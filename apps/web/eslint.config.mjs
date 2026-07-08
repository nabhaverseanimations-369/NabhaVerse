import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import rootConfig from "../../eslint.config.mjs";

export default defineConfig([
  ...rootConfig,
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: ["storybook-static/**", "coverage/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@nabhaverse/database", "@nabhaverse/ai"],
              message:
                "Web modules must consume server capabilities through contracts, never infrastructure packages.",
            },
            {
              group: ["../../api/**", "../../workers/**", "apps/api/**", "apps/workers/**"],
              message: "Web modules must not import implementation code from other applications.",
            },
          ],
        },
      ],
    },
  },
]);
