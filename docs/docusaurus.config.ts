import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "Nitro Version Check",
  tagline: "A fast, modern version-checking library for React Native, powered by Nitro Modules.",
  favicon: "/img/nos.png",

  url: "https://alshehriali0.github.io",
  baseUrl: "/react-native-nitro-version-check/",

  organizationName: "AlshehriAli0",
  projectName: "react-native-nitro-version-check",
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  onBrokenMarkdownLinks: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  future: {
    experimental_faster: true,
    v4: true,
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/AlshehriAli0/react-native-nitro-version-check/tree/main/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  themeConfig: {
    image: "img/social-cards/og-card.png",
    metadata: [
      {
        property: "og:site_name",
        content: "Nitro Version Check",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:description",
        content: "A fast, modern version-checking library for React Native, powered by Nitro Modules.",
      },
      {
        property: "og:image",
        content: "/img/social-cards/og-card.png",
      },
      {
        name: "keywords",
        content:
          "react, native, nitro, version, check, react-native, nitro-modules, app-update, version-check, store-version",
      },
    ],
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Nitro Version Check",
      logo: {
        alt: "Nitro Version Check Logo",
        src: "img/nos.png",
      },
      items: [
        {
          to: "/docs/getting-started",
          position: "right",
          label: "Docs",
          activeBaseRegex: "/docs/getting-started$",
        },
        {
          to: "/docs/installation",
          position: "right",
          label: "Installation",
          activeBaseRegex: "/docs/installation$",
        },
        {
          to: "/docs/api-reference",
          position: "right",
          label: "API",
          activeBaseRegex: "/docs/api-reference$",
        },
        {
          href: "https://www.npmjs.com/package/react-native-nitro-version-check",
          label: "npm",
          position: "right",
        },
        {
          href: "https://github.com/AlshehriAli0/react-native-nitro-version-check",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/docs/getting-started",
            },
            {
              label: "API Reference",
              to: "/docs/api-reference",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/AlshehriAli0/react-native-nitro-version-check",
            },
            {
              label: "npm",
              href: "https://www.npmjs.com/package/react-native-nitro-version-check",
            },
          ],
        },
      ],
      copyright: `Copyright \u00A9 ${new Date().getFullYear()} AlshehriAli0`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ["bash", "json", "kotlin", "ruby", "cmake", "groovy", "java"],
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
        {
          className: "code-block-diff-add-line",
          line: "diff-add",
        },
        {
          className: "code-block-diff-remove-line",
          line: "diff-remove",
        },
        {
          className: "code-block-error-line",
          line: "code-error",
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
