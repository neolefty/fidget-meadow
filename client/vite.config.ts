import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The client always connects same-origin ("/ws"). In dev, Vite proxies the
// WebSocket to the local game server; in production the Node server serves
// both the static client and the socket on one port. Identical code path.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ws": {
        target: "ws://localhost:8787",
        ws: true,
      },
    },
  },
});
