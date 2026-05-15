import type { MetadataRoute } from "next";
import { prisma } from "@/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  // Dynamic news pages
  try {
    const posts = await prisma.newsPost.findMany({
      where: { published: true },
      select: { slug: true, publishedAt: true, createdAt: true },
      orderBy: { publishedAt: "desc" },
    });

    const newsPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/news/${post.slug}`,
      lastModified: post.publishedAt ?? post.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...newsPages];
  } catch {
    return staticPages;
  }
}
