"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { slugify } from "@/lib/utils";
import { normalizeStoragePath } from "@/server/storage/resolve-url";

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function emptyToNull(value: string): string | null {
  return value.trim() || null;
}

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function buildNewsData(formData: FormData) {
  const title = getString(formData, "title");
  const slug = getString(formData, "slug") || slugify(title);
  const excerpt = getString(formData, "excerpt");
  const content = getString(formData, "content");
  const thumbnailPath = normalizeStoragePath(getString(formData, "thumbnailPath")) || null;
  const published = formData.get("published") === "true";
  const featured = formData.get("featured") === "true";
  const seoTitle = getString(formData, "seoTitle");
  const seoDescription = getString(formData, "seoDescription");
  const tags = parseTags(getString(formData, "tags"));

  if (!title || !slug) {
    return { success: false as const, error: "Vui lòng nhập tiêu đề và slug" };
  }

  return {
    success: true as const,
    data: {
      title,
      slug,
      excerpt: emptyToNull(excerpt),
      content: emptyToNull(content),
      thumbnailPath,
      featured,
      published,
      seoTitle: emptyToNull(seoTitle),
      seoDescription: emptyToNull(seoDescription),
      tags,
    },
  };
}

export async function createNewsPost(formData: FormData) {
  const parsed = buildNewsData(formData);
  if (!parsed.success) return parsed;

  try {
    await prisma.newsPost.create({
      data: {
        ...parsed.data,
        imagePaths: [],
        publishedAt: parsed.data.published ? new Date() : null,
      },
    });

    revalidateNewsPaths(parsed.data.slug);
    return { success: true };
  } catch (error) {
    console.error("Create news error:", error);
    return { success: false, error: "Slug đã tồn tại hoặc có lỗi xảy ra" };
  }
}

export async function updateNewsPost(id: string, formData: FormData) {
  const parsed = buildNewsData(formData);
  if (!parsed.success) return parsed;

  try {
    const current = await prisma.newsPost.findUnique({ where: { id }, select: { slug: true, publishedAt: true } });
    const publishedAt = parsed.data.published ? current?.publishedAt ?? new Date() : null;

    await prisma.newsPost.update({
      where: { id },
      data: {
        ...parsed.data,
        publishedAt,
      },
    });

    revalidateNewsPaths(parsed.data.slug);
    if (current?.slug && current.slug !== parsed.data.slug) revalidatePath(`/news/${current.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Update news error:", error);
    return { success: false, error: "Có lỗi xảy ra khi cập nhật" };
  }
}

export async function deleteNewsPost(id: string) {
  try {
    const post = await prisma.newsPost.delete({ where: { id }, select: { slug: true } });
    revalidateNewsPaths(post.slug);
    return { success: true };
  } catch (error) {
    console.error("Delete news error:", error);
    return { success: false, error: "Không xoá được bài viết" };
  }
}

export async function toggleNewsPostPublished(id: string, published: boolean) {
  try {
    const post = await prisma.newsPost.update({
      where: { id },
      data: { published, publishedAt: published ? new Date() : null },
      select: { slug: true },
    });
    revalidateNewsPaths(post.slug);
    return { success: true };
  } catch (error) {
    console.error("Toggle news published error:", error);
    return { success: false, error: "Không cập nhật được trạng thái xuất bản" };
  }
}

export async function toggleNewsPostFeatured(id: string, featured: boolean) {
  try {
    const post = await prisma.newsPost.update({
      where: { id },
      data: { featured },
      select: { slug: true },
    });
    revalidateNewsPaths(post.slug);
    return { success: true };
  } catch (error) {
    console.error("Toggle news featured error:", error);
    return { success: false, error: "Không cập nhật được trạng thái nổi bật" };
  }
}

function revalidateNewsPaths(slug: string) {
  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  revalidatePath("/admin/news");
}
