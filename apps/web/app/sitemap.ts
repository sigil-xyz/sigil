import type { MetadataRoute } from "next";
import { MOCK_SIGILS, MOCK_AGENTS } from "@/data/mock";

const BASE = "https://sigil.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const sigilRoutes = MOCK_SIGILS.map((s) => ({
    url: `${BASE}/dashboard/sigils/${s.id}`,
    lastModified: new Date(s.issuedAt),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const agentRoutes = MOCK_AGENTS.map((a) => ({
    url: `${BASE}/registry/agents/${a.id}`,
    lastModified: new Date(a.lastActive),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/registry`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...sigilRoutes,
    ...agentRoutes,
  ];
}
