import { defineConfig } from "remotion";

export const config = defineConfig({
  bucketName: "autoyt-videos",
  ssrApex: process.env.REMOTION_SSR_APEX,
});
