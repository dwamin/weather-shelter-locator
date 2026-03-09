import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Weather Shelter Locator",
    short_name: "Shelter",
    description: "Find nearby weather shelters during heat waves and cold snaps.",
    start_url: "/",
    display: "standalone",
    background_color: "#ecfdf5",
    theme_color: "#166534",
    lang: "ko-KR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
