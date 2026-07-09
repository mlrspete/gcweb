import type { MetadataRoute } from "next";

import { getCanonicalUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${getCanonicalUrl()}sitemap.xml`,
  };
}
