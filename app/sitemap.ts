import type { MetadataRoute } from "next";

import { getCanonicalUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/privacy", "/terms", "/satisfaction-guarantee"];

  return routes.map((route) => ({
    url: getCanonicalUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : 0.5,
  }));
}
