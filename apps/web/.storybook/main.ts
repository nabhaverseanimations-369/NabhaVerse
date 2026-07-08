import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    const aliases: Array<{ find: string; replacement: string }> = [];

    if (Array.isArray(config.resolve.alias)) {
      for (const alias of config.resolve.alias) {
        if (typeof alias.find === "string" && typeof alias.replacement === "string") {
          aliases.push({ find: alias.find, replacement: alias.replacement });
        }
      }
    } else if (config.resolve.alias && typeof config.resolve.alias === "object") {
      for (const [find, replacement] of Object.entries(config.resolve.alias)) {
        if (typeof replacement === "string") {
          aliases.push({ find, replacement });
        }
      }
    }

    aliases.push(
      {
        find: "next/link",
        replacement: path.resolve(__dirname, "./mocks/next-link.tsx"),
      },
      {
        find: "next/navigation",
        replacement: path.resolve(__dirname, "./mocks/next-navigation.ts"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "../src"),
      },
    );

    config.resolve.alias = aliases;
    return config;
  },
};

export default config;
