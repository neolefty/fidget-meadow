// Protocol source of truth (docs/ARCHITECTURE.md § Protocol).
// Extend the unions first; the compiler then points at every switch that
// needs a new case, client and server.

export type PlayerId = string;

export interface PlayerSnapshot {
  id: PlayerId;
  name: string;
  avatar: string;
  x: number;
  y: number;
}

export interface WorldSnapshot {
  players: PlayerSnapshot[];
}

export type MoveDir = "north" | "south" | "east" | "west";

export type ClientMsg =
  | {
      t: "join";
      name: string;
      avatar: string;
      token?: string;
    }
  /** Intent only — the server applies rules and broadcasts `pos` (or not). */
  | { t: "move"; dir: MoveDir };

// Sync model (D15): `welcome` carries the full snapshot once, then tiny
// patches keep everyone current. Receivers upsert `player` by id.
export type ServerMsg =
  | { t: "welcome"; you: PlayerId; token: string; snapshot: WorldSnapshot }
  | { t: "toast"; text: string }
  /** One player's full public state — broadcast on join and reconnect. */
  | { t: "player"; player: PlayerSnapshot }
  /** Position patch — broadcast after a server-approved move. */
  | { t: "pos"; id: PlayerId; x: number; y: number };

function isPlayerSnapshot(v: unknown): v is PlayerSnapshot {
  if (typeof v !== "object" || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.avatar === "string" &&
    typeof p.x === "number" &&
    typeof p.y === "number"
  );
}

/** Validate one wire message from a client. Returns null on anything bogus. */
export function parseClientMsg(raw: unknown): ClientMsg | null {
  if (typeof raw !== "string") return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const msg = data as Record<string, unknown>;
  switch (msg.t) {
    case "join": {
      if (
        typeof msg.name === "string" &&
        typeof msg.avatar === "string" &&
        (msg.token === undefined || typeof msg.token === "string")
      ) {
        const parsed: ClientMsg = { t: "join", name: msg.name, avatar: msg.avatar };
        if (typeof msg.token === "string") parsed.token = msg.token;
        return parsed;
      }
      return null;
    }
    case "move": {
      const dir = msg.dir;
      if (dir === "north" || dir === "south" || dir === "east" || dir === "west") {
        return { t: "move", dir };
      }
      return null;
    }
    default:
      return null;
  }
}

/** Validate one wire message from the server (used by the client). */
export function parseServerMsg(raw: unknown): ServerMsg | null {
  if (typeof raw !== "string") return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const msg = data as Record<string, unknown>;
  switch (msg.t) {
    case "welcome": {
      if (
        typeof msg.you === "string" &&
        typeof msg.token === "string" &&
        typeof msg.snapshot === "object" &&
        msg.snapshot !== null &&
        Array.isArray((msg.snapshot as Record<string, unknown>).players)
      ) {
        return {
          t: "welcome",
          you: msg.you,
          token: msg.token,
          snapshot: msg.snapshot as unknown as WorldSnapshot,
        };
      }
      return null;
    }
    case "toast":
      return typeof msg.text === "string" ? { t: "toast", text: msg.text } : null;
    case "player":
      return isPlayerSnapshot(msg.player) ? { t: "player", player: msg.player } : null;
    case "pos": {
      if (
        typeof msg.id === "string" &&
        typeof msg.x === "number" &&
        typeof msg.y === "number"
      ) {
        return { t: "pos", id: msg.id, x: msg.x, y: msg.y };
      }
      return null;
    }
    default:
      return null;
  }
}
