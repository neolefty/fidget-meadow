// Map data model. Map files are JSON with rows of single-char tile codes
// (see TILE_CHARS and client/public/starter-meadow.json); parseMeadowMap
// expands them into the row-major MeadowMap grid. D14 in docs/DECISIONS.md.

/** Every tile kind renders as colored square + emoji until real art exists. */
export type TileKind = "grass" | "path" | "water" | "flowerbed" | "hedge";

export interface TilePlaceholder {
  color: number; // 0xRRGGBB
  emoji: string;
}

export const TILE_PLACEHOLDERS: Record<TileKind, TilePlaceholder> = {
  grass: { color: 0x76b041, emoji: "🌿" },
  path: { color: 0xc2a878, emoji: "" },
  water: { color: 0x4f86c6, emoji: "💧" },
  flowerbed: { color: 0x8a5a83, emoji: "🌸" },
  hedge: { color: 0x3e6b2f, emoji: "🌳" },
};

/** A map is a grid of tile kinds plus object placements (M7+). */
export interface MeadowMap {
  width: number;
  height: number;
  /** Row-major, length = width * height. */
  tiles: TileKind[];
  // next: objects: ObjectPlacement[] — but define the interact rules first
}

/** Single-char codes used by `rows` in map JSON files. */
export const TILE_CHARS: Record<string, TileKind> = {
  g: "grass",
  p: "path",
  w: "water",
  f: "flowerbed",
  h: "hedge",
};

/** Tile kinds a player can stand on: hedge walls the world, water is wet. */
const WALKABLE: Record<TileKind, boolean> = {
  grass: true,
  path: true,
  flowerbed: true,
  water: false,
  hedge: false,
};

export function isWalkable(kind: TileKind): boolean {
  return WALKABLE[kind];
}

/** Tile at (x, y), or null outside the map. */
export function tileAt(map: MeadowMap, x: number, y: number): TileKind | null {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return null;
  return map.tiles[y * map.width + x] ?? null;
}

/**
 * Validate raw map JSON (`{ "rows": ["hhh", "hgh", ...] }`) into a MeadowMap.
 * Returns null on anything bogus, same defensive shape as parseClientMsg.
 */
export function parseMeadowMap(raw: unknown): MeadowMap | null {
  if (typeof raw !== "string") return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const rows = (data as Record<string, unknown>).rows;
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const first = rows[0];
  if (typeof first !== "string" || first.length === 0) return null;

  const width = first.length;
  const height = rows.length;
  const tiles: TileKind[] = [];
  for (const row of rows) {
    if (typeof row !== "string" || row.length !== width) return null;
    for (const ch of row) {
      const kind = TILE_CHARS[ch];
      if (kind === undefined) return null;
      tiles.push(kind);
    }
  }
  return { width, height, tiles };
}
