// Placeholder rendering: colored square + emoji (AGENTS.md: placeholders
// are first-class). Tiles use it now; avatars and objects will too.

import { Container, Graphics, Text } from "pixi.js";
import type { TilePlaceholder } from "@fidget/shared";

/** Build a `size`×`size` colored square with the emoji centered on top. */
export function makePlaceholder(ph: TilePlaceholder, size: number): Container {
  const container = new Container();
  container.addChild(new Graphics().rect(0, 0, size, size).fill(ph.color));
  if (ph.emoji !== "") {
    const emoji = new Text({
      text: ph.emoji,
      style: { fontSize: Math.round(size * 0.7) },
    });
    emoji.anchor.set(0.5);
    emoji.position.set(size / 2, size / 2);
    container.addChild(emoji);
  }
  return container;
}
