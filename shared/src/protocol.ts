// Protocol source of truth (docs/ARCHITECTURE.md § Protocol).
// Extend the unions first; the compiler then points at every switch that
// needs a new case, client and server. M1 scope: join / welcome / toast.

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

export type ClientMsg = {
  t: "join";
  name: string;
  avatar: string;
  token?: string;
};

export type ServerMsg =
  | { t: "welcome"; you: PlayerId; token: string; snapshot: WorldSnapshot }
  | { t: "toast"; text: string };

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
    default:
      return null;
  }
}
