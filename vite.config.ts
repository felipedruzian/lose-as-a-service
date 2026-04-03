import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  root: "web",
  base: command === "build" ? "/app/" : "/",
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/perdi": "http://127.0.0.1:3000",
      "/openapi.json": "http://127.0.0.1:3000",
      "/docs": "http://127.0.0.1:3000"
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
}));
