import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: false,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.tsx"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/components/**/*.tsx", "src/app/(app)/**/*.tsx", "src/lib/**/*.tsx"],
      exclude: ["src/**/*.stories.tsx", "src/test/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@nabhaverse/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
    },
  },
});
