import type { MetadataRoute } from "next";

const BASE = "https://sigil.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/registry`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
