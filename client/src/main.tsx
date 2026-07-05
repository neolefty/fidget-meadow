import { createRoot } from "react-dom/client";
import { App } from "./App";
import { mountStage } from "./game/stage";
import { connect } from "./net/socket";

connect();

const stageEl = document.getElementById("stage");
const rootEl = document.getElementById("root");
if (!stageEl || !rootEl) throw new Error("index.html is missing #stage/#root");

void mountStage(stageEl);
createRoot(rootEl).render(<App />);
