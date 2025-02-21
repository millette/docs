import { defineUserConfig } from "vuepress";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Gorse",
      description: "An open source recommender system service written in Go",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "Gorse",
      description: "开箱即用的开源推荐系统",
    },
  },

  theme,

  shouldPrefetch: false,

  plugins: [
    docsearchPlugin({
      apiKey: 'edd7075e83b0f14d48ea946c8fd98d0f',
      indexName: 'gorse',
      appId: 'KH1GFD6Q0P',
    }),
  ],
});
