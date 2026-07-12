import { createRoot } from "react-dom/client";
import { App } from "./App";
import { attachKeyboard } from "./game/input";
import { mountStage } from "./game/stage";
import { connect } from "./net/socket";

connect();
attachKeyboard();

const stageEl = document.getElementById("stage");
const rootEl = document.getElementById("root");
if (!stageEl || !rootEl) throw new Error("index.html is missing #stage/#root");

void mountStage(stageEl);
createRoot(rootEl).render(<App />);
