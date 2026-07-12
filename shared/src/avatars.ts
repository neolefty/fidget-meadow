// Avatar placeholders: the hardcoded picker list (join screen, M3/M4) and
// the colored square + emoji each renders as until real art exists.

import type { TilePlaceholder } from "./map";

export const AVATAR_PLACEHOLDERS: Record<string, TilePlaceholder> = {
  sprout: { color: 0xa3d977, emoji: "🌱" },
  fox: { color: 0xd97b29, emoji: "🦊" },
  frog: { color: 0x5cb85c, emoji: "🐸" },
  bee: { color: 0xf0c93b, emoji: "🐝" },
  hedgehog: { color: 0xa5836a, emoji: "🦔" },
  snail: { color: 0xb59ecf, emoji: "🐌" },
};

/** Placeholder for an avatar id; unknown ids get a visible fallback. */
export function avatarPlaceholder(avatar: string): TilePlaceholder {
  return AVATAR_PLACEHOLDERS[avatar] ?? { color: 0xcccccc, emoji: "❓" };
}
