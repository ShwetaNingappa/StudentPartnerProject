import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Allow overriding the base at build time (useful for some static hosts)
  base: process.env.VITE_BASE || (mode === "production" ? "/" : "/"),
  build: {
    outDir: "dist",
    sourcemap: mode !== "production"
  }
}));
