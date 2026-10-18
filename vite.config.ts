import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import routeShells from "./scripts/vite-route-shells.ts";

export default defineConfig({
  base: "/",
  plugins: [react(), routeShells()],
  build: { outDir: "build", target: "es2020", sourcemap: false },
  server: { port: 3000 },
});
