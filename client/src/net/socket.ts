// The single client-side store (docs/ARCHITECTURE.md § Client: two layers).
// The socket feeds it; both React (useSyncExternalStore) and the Pixi layer
// subscribe to it. Keep it small but shaped for growth.

import {
  parseServerMsg,
  type ClientMsg,
  type PlayerId,
  type WorldSnapshot,
} from "@fidget/shared";

export interface NetState {
  status: "connecting" | "joined" | "disconnected";
  you?: PlayerId;
  snapshot?: WorldSnapshot;
  lastToast?: string;
}

const TOKEN_KEY = "fidget-token";

let state: NetState = { status: "connecting" };
const listeners = new Set<() => void>();

function setState(patch: Partial<NetState>): void {
  state = { ...state, ...patch };
  for (const fn of listeners) fn();
}

/** Subscribe to store changes. Returns an unsubscribe function. */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Current store snapshot (stable reference between changes). */
export function getState(): NetState {
  return state;
}

let socket: WebSocket | null = null;
let retryMs = 500;

function send(msg: ClientMsg): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }
}

/** Open the socket and keep it open (auto-reconnects with backoff). */
export function connect(): void {
  if (socket && socket.readyState !== WebSocket.CLOSED) return;

  setState({ status: "connecting" });
  const url =
    (location.protocol === "https:" ? "wss" : "ws") +
    "://" +
    location.host +
    "/ws";
  const ws = new WebSocket(url);
  socket = ws;

  ws.onopen = () => {
    retryMs = 500;
    const join: ClientMsg = { t: "join", name: "visitor", avatar: "sprout" };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token !== null) join.token = token;
    send(join);
  };

  ws.onmessage = (ev: MessageEvent) => {
    const msg = parseServerMsg(ev.data);
    if (msg === null) return;
    switch (msg.t) {
      case "welcome":
        localStorage.setItem(TOKEN_KEY, msg.token);
        setState({ status: "joined", you: msg.you, snapshot: msg.snapshot });
        break;
      case "toast":
        setState({ lastToast: msg.text });
        break;
    }
  };

  ws.onerror = () => {
    ws.close();
  };

  ws.onclose = () => {
    if (socket !== ws) return; // superseded by a newer socket
    socket = null;
    setState({ status: "disconnected" });
    const delay = retryMs;
    retryMs = Math.min(retryMs * 2, 8000);
    setTimeout(connect, delay);
  };
}
