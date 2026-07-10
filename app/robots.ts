import type { MetadataRoute } from "next";

import { getCanonicalUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  const shouldBlockIndexing =
    process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "development";

  if (shouldBlockIndexing) {
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
      disallow: "/api/",
    },
    sitemap: getCanonicalUrl("/sitemap.xml"),
  };
}
