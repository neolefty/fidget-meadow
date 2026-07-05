// Map data model — M2 sketch, intentionally half-built. Not imported anywhere
// yet; the walking skeleton doesn't know about maps. That's the rail.

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

/** A map is JSON: a grid of tile kinds plus object placements (M7+). */
export interface MeadowMap {
  width: number;
  height: number;
  /** Row-major, length = width * height. */
  tiles: TileKind[];
  // next: objects: ObjectPlacement[] — but define the interact rules first
}

// next: parseMeadowMap(json: unknown): MeadowMap | null (same defensive
// shape as parseClientMsg), a hand-authored starter-meadow.json in
// client/public/, and render it in the Pixi layer (client/src/game/stage.ts
// currently draws one hardcoded rectangle — replace that with the tile grid).
