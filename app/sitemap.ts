import type { MetadataRoute } from "next";

import { getCanonicalUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getCanonicalUrl(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
