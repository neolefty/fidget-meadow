// PixiJS layer. Renders the world behind the React overlay.
// M2: the meadow tile grid from starter-meadow.json, whole-map fixed camera.
// M3 gives the camera a player to follow.

import {
  Application,
  Container,
  Sprite,
  TextureSource,
  type Texture,
} from "pixi.js";
import {
  parseMeadowMap,
  TILE_PLACEHOLDERS,
  type MeadowMap,
  type TileKind,
} from "@fidget/shared";
import { makePlaceholder } from "./placeholder";

/** World-space pixels per tile (screen size comes from the camera scale). */
export const TILE_SIZE = 32;

async function loadMap(): Promise<MeadowMap | null> {
  try {
    const res = await fetch("/starter-meadow.json");
    if (!res.ok) return null;
    return parseMeadowMap(await res.text());
  } catch {
    return null;
  }
}

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

  const map = await loadMap();
  if (map === null) {
    // The map is placeholder-proof but not fetch-proof; leave the field green.
    console.error("starter-meadow.json missing or invalid — rendering nothing");
    return app;
  }

  const world = buildMeadow(app, map);
  app.stage.addChild(world);

  // Fixed camera: fit the whole meadow on screen, centered.
  const layout = (): void => {
    const worldW = map.width * TILE_SIZE;
    const worldH = map.height * TILE_SIZE;
    const scale = Math.min(app.screen.width / worldW, app.screen.height / worldH);
    world.scale.set(scale);
    world.position.set(
      (app.screen.width - worldW * scale) / 2,
      (app.screen.height - worldH * scale) / 2,
    );
  };
  layout();
  app.renderer.on("resize", layout);

  return app;
}
