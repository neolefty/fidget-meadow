// PixiJS layer. Renders the meadow tile grid, the players in it, and a
// clamped-follow camera (~8 tiles across at phone width). React stays an
// overlay; both subscribe to the same store in net/socket.ts.

import {
  Application,
  Container,
  Sprite,
  TextureSource,
  type Texture,
} from "pixi.js";
import {
  avatarPlaceholder,
  parseMeadowMap,
  TILE_PLACEHOLDERS,
  type MeadowMap,
  type PlayerId,
  type TileKind,
} from "@fidget/shared";
import rawMap from "@fidget/shared/maps/starter-meadow.json?raw";
import { getState, subscribe } from "../net/socket";
import { makePlaceholder } from "./placeholder";

/** World-space pixels per tile (screen size comes from the camera scale). */
export const TILE_SIZE = 32;

// Camera: ~8 tiles across keeps tiles ≥44px touch targets on 360–430px
// phones (Bill 2026-07-05); the cap stops desktop tiles from ballooning.
const VIEWPORT_TILES = 8;
const MAX_TILE_PX = 64;

/** One texture per tile kind, rendered once and shared by every sprite. */
function tileTextures(app: Application): Record<TileKind, Texture> {
  const textures = {} as Record<TileKind, Texture>;
  for (const kind of Object.keys(TILE_PLACEHOLDERS) as TileKind[]) {
    textures[kind] = app.renderer.generateTexture(
      makePlaceholder(TILE_PLACEHOLDERS[kind], TILE_SIZE),
    );
  }
  return textures;
}

function buildMeadow(app: Application, map: MeadowMap): Container {
  const world = new Container();
  const textures = tileTextures(app);
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const kind = map.tiles[y * map.width + x];
      if (kind === undefined) continue; // parser guarantees length; belt-and-braces
      const tile = new Sprite(textures[kind]);
      tile.position.set(x * TILE_SIZE, y * TILE_SIZE);
      world.addChild(tile);
    }
  }
  return world;
}

/**
 * Camera offset for one axis: center the focus point, stop at the map
 * edges, center the whole map when it fits on screen. All values in
 * screen pixels (world sizes already scaled).
 */
function cameraOffset(screen: number, world: number, focus: number): number {
  if (world <= screen) return (screen - world) / 2;
  return Math.min(0, Math.max(screen - world, screen / 2 - focus));
}

/** Init Pixi and mount its canvas into `el` (the behind-React layer). */
export async function mountStage(el: HTMLElement): Promise<Application> {
  // Pixel art scales with nearest-neighbor (docs/ARCHITECTURE.md).
  TextureSource.defaultOptions.scaleMode = "nearest";

  const app = new Application();
  await app.init({
    resizeTo: window,
    background: "#16200f",
    antialias: false,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  el.appendChild(app.canvas);

  const map = parseMeadowMap(rawMap);
  if (map === null) {
    // The map is bundled, so this only fires on a bad hand-edit of the JSON.
    console.error("starter-meadow.json invalid — rendering nothing");
    return app;
  }

  const world = buildMeadow(app, map);
  app.stage.addChild(world);

  // Players live inside `world` so the camera transform applies to them too.
  const playersLayer = new Container();
  world.addChild(playersLayer);
  const avatarSprites = new Map<PlayerId, Container>();

  const syncPlayers = (): void => {
    const players = getState().snapshot?.players ?? [];
    const seen = new Set<PlayerId>();
    for (const p of players) {
      seen.add(p.id);
      let sprite = avatarSprites.get(p.id);
      if (sprite === undefined) {
        sprite = makePlaceholder(avatarPlaceholder(p.avatar), TILE_SIZE);
        avatarSprites.set(p.id, sprite);
        playersLayer.addChild(sprite);
      }
      sprite.position.set(p.x * TILE_SIZE, p.y * TILE_SIZE);
    }
    for (const [id, sprite] of avatarSprites) {
      if (!seen.has(id)) {
        sprite.destroy({ children: true });
        avatarSprites.delete(id);
      }
    }
  };

  // Clamped-follow camera at fixed tile scale. Until we know who "you" are
  // (connecting), it looks at the map center.
  const layout = (): void => {
    const scale = Math.min(app.screen.width / VIEWPORT_TILES, MAX_TILE_PX) / TILE_SIZE;
    world.scale.set(scale);

    const { you, snapshot } = getState();
    const me = snapshot?.players.find((p) => p.id === you);
    const focusX = (me !== undefined ? (me.x + 0.5) * TILE_SIZE : (map.width * TILE_SIZE) / 2) * scale;
    const focusY = (me !== undefined ? (me.y + 0.5) * TILE_SIZE : (map.height * TILE_SIZE) / 2) * scale;
    world.position.set(
      cameraOffset(app.screen.width, map.width * TILE_SIZE * scale, focusX),
      cameraOffset(app.screen.height, map.height * TILE_SIZE * scale, focusY),
    );
  };

  const refresh = (): void => {
    syncPlayers();
    layout();
  };
  refresh();
  subscribe(refresh);
  app.renderer.on("resize", layout);

  return app;
}
