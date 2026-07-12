// Pure in-memory world state. Server-authoritative: game rules live here,
// sockets live in main.ts. No persistence yet — SQLite is milestone M5.

import { randomUUID } from "node:crypto";
import {
  isWalkable,
  tileAt,
  type MeadowMap,
  type MoveDir,
  type PlayerId,
  type PlayerSnapshot,
  type WorldSnapshot,
} from "@fidget/shared";

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
  map: MeadowMap;
  /** Players keyed by their reconnect token. */
  players: Map<string, Player>;
  genId: IdGenerator;
  spawn: { x: number; y: number };
}

export function createWorld(map: MeadowMap, genId: IdGenerator = randomUUID): World {
  return { map, players: new Map(), genId, spawn: findSpawn(map) };
}

/** The path tile nearest the map's center — deterministic and walkable. */
function findSpawn(map: MeadowMap): { x: number; y: number } {
  const cx = (map.width - 1) / 2;
  const cy = (map.height - 1) / 2;
  let best: { x: number; y: number } | null = null;
  let bestDist = Infinity;
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      if (tileAt(map, x, y) !== "path") continue;
      const dist = (x - cx) ** 2 + (y - cy) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        best = { x, y };
      }
    }
  }
  if (best === null) throw new Error("map has no path tile to spawn on");
  return best;
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
    x: world.spawn.x,
    y: world.spawn.y,
  };
  world.players.set(player.token, player);
  return { player, isReconnect: false };
}

const DIR_DELTA: Record<MoveDir, { dx: number; dy: number }> = {
  north: { dx: 0, dy: -1 },
  south: { dx: 0, dy: 1 },
  west: { dx: -1, dy: 0 },
  east: { dx: 1, dy: 0 },
};

/**
 * Apply a move intent. Mutates the player and returns true only if the
 * target tile is on the map and walkable; a refused move is silent — the
 * client shows no wiggle because nothing is broadcast.
 */
export function move(world: World, player: Player, dir: MoveDir): boolean {
  const { dx, dy } = DIR_DELTA[dir];
  const tile = tileAt(world.map, player.x + dx, player.y + dy);
  if (tile === null || !isWalkable(tile)) return false;
  player.x += dx;
  player.y += dy;
  return true;
}

/** Public view of the world — tokens deliberately excluded. */
export function snapshot(world: World): WorldSnapshot {
  return { players: [...world.players.values()].map(toPlayerSnapshot) };
}

export function toPlayerSnapshot(p: Player): PlayerSnapshot {
  return { id: p.id, name: p.name, avatar: p.avatar, x: p.x, y: p.y };
}
