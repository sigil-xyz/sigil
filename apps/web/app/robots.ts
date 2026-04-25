import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/registry", "/registry/agents/"],
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: "https://sigil.xyz/sitemap.xml",
    host: "https://sigil.xyz",
  };
}
