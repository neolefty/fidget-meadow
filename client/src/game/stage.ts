// PixiJS layer. Renders the world behind the React overlay.
// M1: one placeholder meadow-green rounded square, roughly centered.

import { Application, Graphics, TextureSource } from "pixi.js";

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

  const size = 160;
  const square = new Graphics()
    .roundRect(-size / 2, -size / 2, size, size, 20)
    .fill(0x76b041); // placeholder meadow green
  app.stage.addChild(square);

  const center = (): void => {
    square.position.set(app.screen.width / 2, app.screen.height / 2);
  };
  center();
  app.renderer.on("resize", center);

  return app;
}
