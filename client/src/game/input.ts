// Desktop input: arrow keys → move intents. Tap-to-move is M4.

import type { MoveDir } from "@fidget/shared";
import { sendMove } from "../net/socket";

const KEY_DIRS: Record<string, MoveDir> = {
  ArrowUp: "north",
  ArrowDown: "south",
  ArrowLeft: "west",
  ArrowRight: "east",
};

export function attachKeyboard(): void {
  window.addEventListener("keydown", (ev) => {
    const dir = KEY_DIRS[ev.key];
    if (dir === undefined) return;
    ev.preventDefault(); // arrows scroll the page otherwise
    sendMove(dir);
  });
}
