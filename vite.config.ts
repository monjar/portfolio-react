import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: { outDir: "build", target: "es2020", sourcemap: false },
  server: { port: 3000 },
});
