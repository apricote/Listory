import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [react()],
    resolve: {
      alias: {
        src: path.resolve(__dirname, "./src"),
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./tests/setup.js",
    },
  };
});
