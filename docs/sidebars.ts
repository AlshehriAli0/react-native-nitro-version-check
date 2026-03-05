import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Getting Started",
      items: ["getting-started", "installation", "compatibility"],
    },
    {
      type: "category",
      label: "API",
      items: ["api-reference", "usage-examples"],
    },
    {
      type: "category",
      label: "Resources",
      items: ["migration-guide", "contributing"],
    },
  ],
};

export default sidebars;
