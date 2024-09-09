import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "./src/renderer",
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {},
  },
  build: {
    outDir: "../../dist/renderer",
    emptyOutDir: true,
  },
  server: {
    port: 3001,
  },
});
