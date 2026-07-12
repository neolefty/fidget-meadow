// Entry point: node:http for static client assets + `ws` on /ws for the game.
// The server is authoritative — clients send intents, world.ts decides.

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer, WebSocket } from "ws";
import { parseClientMsg, parseMeadowMap, type ServerMsg } from "@fidget/shared";
import { createWorld, join, move, snapshot, toPlayerSnapshot, type Player } from "./world";

const PORT = Number(process.env.PORT ?? 8787);

// server/src/main.ts → ../../client/dist. Same shape in the Docker image:
// /app/server/src/main.ts → /app/client/dist.
const CLIENT_DIST = fileURLToPath(new URL("../../client/dist", import.meta.url));

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
};

async function serveStatic(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!existsSync(CLIENT_DIST)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("client not built (no client/dist) — in dev, use the Vite server");
    return;
  }

  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }

  const relative = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = path.resolve(CLIENT_DIST, relative);
  // No path traversal: the resolved path must stay inside client/dist.
  if (!filePath.startsWith(CLIENT_DIST + path.sep)) {
    res.writeHead(403).end();
    return;
  }

  try {
    const body = await readFile(filePath);
    const type = CONTENT_TYPES[path.extname(filePath)] ?? "application/octet-stream";
    res.writeHead(200, { "content-type": type });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
  }
}

// One map, one source of truth: shared/maps (the client bundles the same
// file at build time). server/src → ../../shared/maps, same shape in Docker.
const MAP_PATH = fileURLToPath(
  new URL("../../shared/maps/starter-meadow.json", import.meta.url),
);
const map = parseMeadowMap(await readFile(MAP_PATH, "utf8"));
if (map === null) throw new Error(`invalid meadow map at ${MAP_PATH}`);

const world = createWorld(map);
const httpServer = createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end("ok");
    return;
  }
  void serveStatic(req, res);
});

const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
const sockets = new Set<WebSocket>();

function send(ws: WebSocket, msg: ServerMsg): void {
  ws.send(JSON.stringify(msg));
}

function broadcast(msg: ServerMsg, except?: WebSocket): void {
  for (const ws of sockets) {
    if (ws !== except && ws.readyState === WebSocket.OPEN) send(ws, msg);
  }
}

wss.on("connection", (ws) => {
  sockets.add(ws);
  // The player this socket speaks for, set by its join message.
  let player: Player | null = null;

  ws.on("message", (data) => {
    const msg = parseClientMsg(data.toString());
    if (msg === null) {
      console.warn("ignoring invalid client message");
      return;
    }
    switch (msg.t) {
      case "join": {
        const result = join(world, msg);
        player = result.player;
        send(ws, {
          t: "welcome",
          you: player.id,
          token: player.token,
          snapshot: snapshot(world),
        });
        // Everyone else upserts the (re)joined player — a reconnect may
        // carry a re-picked name or avatar.
        broadcast({ t: "player", player: toPlayerSnapshot(player) }, ws);
        if (!result.isReconnect) {
          broadcast({ t: "toast", text: `${player.name} wandered into the meadow` }, ws);
        }
        break;
      }
      case "move": {
        if (player === null) return; // move before join — ignore
        if (move(world, player, msg.dir)) {
          broadcast({ t: "pos", id: player.id, x: player.x, y: player.y });
        }
        break;
      }
    }
  });

  // Closing the socket only forgets the connection; the player persists
  // in-memory. Interruptibility is a design invariant.
  ws.on("close", () => sockets.delete(ws));
  ws.on("error", (err) => console.warn("socket error:", err.message));
});

httpServer.listen(PORT, () => {
  console.log(`fidget-meadow server listening on http://localhost:${PORT} (ws at /ws)`);
  if (!existsSync(CLIENT_DIST)) {
    console.log(`no client build at ${CLIENT_DIST} — serving websocket only`);
  }
});
