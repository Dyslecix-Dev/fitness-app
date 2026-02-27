import type { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    // TODO: Change name, short_name, and description
    name: "Fitness App - Wellness Tracker",
    short_name: "Fitness App",
    description: "All-in-one workout, nutrition, and mental wellness tracker",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    // TODO: Change colors
    background_color: "#ffffff",
    theme_color: "#ffffff",
    // TODO: Add icons
    // icons: [
    //   {
    //     src: "/android-chrome-192x192.png",
    //     sizes: "192x192",
    //     type: "image/png",
    //     purpose: "any",
    //   },
    //   {
    //     src: "/android-chrome-512x512.png",
    //     sizes: "512x512",
    //     type: "image/png",
    //     purpose: "any",
    //   },
    //   {
    //     src: "/android-chrome-512x512.png",
    //     sizes: "512x512",
    //     type: "image/png",
    //     purpose: "maskable",
    //   },
    // ],
  };
}
