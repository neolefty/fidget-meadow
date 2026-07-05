// React overlay: connection state, the M1 "joined as <id>" proof, toasts.
// Ugly is correct at this stage; sizes stay touch-friendly.

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { getState, subscribe } from "./net/socket";

const overlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding:
    "calc(env(safe-area-inset-top) + 16px) 16px calc(env(safe-area-inset-bottom) + 16px)",
  pointerEvents: "none",
};

const pillStyle: CSSProperties = {
  minHeight: 48,
  display: "flex",
  alignItems: "center",
  padding: "8px 20px",
  borderRadius: 24,
  background: "rgba(20, 28, 14, 0.85)",
  fontSize: 18,
  lineHeight: 1.3,
  textAlign: "center",
};

export function App() {
  const net = useSyncExternalStore(subscribe, getState);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (net.lastToast === undefined) return;
    setToast(net.lastToast);
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [net.lastToast]);

  return (
    <div style={overlayStyle}>
      <div style={pillStyle}>
        {net.status === "joined" && net.you !== undefined ? (
          <strong>joined as {net.you}</strong>
        ) : net.status === "connecting" ? (
          "connecting…"
        ) : (
          "disconnected — reconnecting…"
        )}
      </div>
      <div style={{ flex: 1 }} />
      {toast !== null && (
        <div style={{ ...pillStyle, background: "rgba(118, 176, 65, 0.9)", color: "#16200f" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
