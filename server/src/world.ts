// Pure in-memory world state. Server-authoritative: game rules live here,
// sockets live in main.ts. No persistence yet — SQLite is milestone M5.

import { randomUUID } from "node:crypto";
import type { PlayerId, PlayerSnapshot, WorldSnapshot } from "@fidget/shared";

/** Generates opaque unique strings (player ids and reconnect tokens). */
export type IdGenerator = () => string;

export interface Player {
  id: PlayerId;
  /** Secret reconnect token — never leaves the server except in `welcome`. */
  token: string;
  name: string;
  avatar: string;
  x: number;
  y: number;
}

export interface World {
  /** Players keyed by their reconnect token. */
  players: Map<string, Player>;
  genId: IdGenerator;
}

const SPAWN = { x: 0, y: 0 };

export function createWorld(genId: IdGenerator = randomUUID): World {
  return { players: new Map(), genId };
}

export interface JoinRequest {
  name: string;
  avatar: string;
  token?: string;
}

export interface JoinResult {
  player: Player;
  isReconnect: boolean;
}

/**
 * Join the meadow. A known token resumes that player (position and all —
 * putting the phone down must never cost anything); otherwise a new player
 * is created at the spawn point with a fresh id + token.
 */
export function join(world: World, req: JoinRequest): JoinResult {
  if (req.token !== undefined) {
    const existing = world.players.get(req.token);
    if (existing !== undefined) {
      // Returning player may have re-picked their name/avatar on the join
      // screen; honor that, keep everything else.
      existing.name = req.name;
      existing.avatar = req.avatar;
      return { player: existing, isReconnect: true };
    }
  }
  const player: Player = {
    id: world.genId(),
    token: world.genId(),
    name: req.name,
    avatar: req.avatar,
    x: SPAWN.x,
    y: SPAWN.y,
  };
  world.players.set(player.token, player);
  return { player, isReconnect: false };
}

/** Public view of the world — tokens deliberately excluded. */
export function snapshot(world: World): WorldSnapshot {
  return { players: [...world.players.values()].map(toPlayerSnapshot) };
}

export function toPlayerSnapshot(p: Player): PlayerSnapshot {
  return { id: p.id, name: p.name, avatar: p.avatar, x: p.x, y: p.y };
}
