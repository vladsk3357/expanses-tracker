import type { MetadataRoute } from "next";

import { getLocale } from "@/core/i18n/locale";
import { getMessages } from "@/core/i18n/messages";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getLocale();
  const d = getMessages(locale);

  return {
    name: d.meta.manifestName,
    short_name: d.meta.manifestShortName,
    description: d.meta.manifestDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#171717",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
