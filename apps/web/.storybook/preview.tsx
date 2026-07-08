import type { Preview } from "@storybook/react";
import * as React from "react";
import { ThemeProvider } from "@nabhaverse/ui";

import "../src/app/globals.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="system">
        <div className="min-h-screen bg-[var(--color-background)] p-6 text-[var(--color-text-primary)]">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
