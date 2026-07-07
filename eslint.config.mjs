import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

const domainLayerRules = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        {
          group: ["**/application/**", "**/infrastructure/**", "**/presentation/**"],
          message: "Domain code must stay independent of outer layers.",
        },
      ],
    },
  ],
};

export default defineConfig([
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["packages/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@nabhaverse/database", "@nabhaverse/ai", "next", "next/*"],
              message: "The UI package must remain framework-light and free of infrastructure concerns.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/types/**/*.{ts,tsx}", "packages/config/**/*.{ts,tsx}", "packages/utils/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react/*", "next", "next/*"],
              message: "Core shared packages must stay framework-agnostic.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/src/domain/**/*.{ts,tsx}"],
    rules: domainLayerRules,
  },
  {
    files: ["**/src/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/infrastructure/**", "**/presentation/**"],
              message: "Application layer must not depend on infrastructure or presentation implementations.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/src/presentation/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/infrastructure/**"],
              message: "Presentation modules must depend on application contracts, not infrastructure details.",
            },
          ],
        },
      ],
    },
  },
]);
