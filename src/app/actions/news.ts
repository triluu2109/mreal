"use server";

import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function createNewsPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || slugify(title);
    const excerpt = (formData.get("excerpt") as string) || null;
    const content = (formData.get("content") as string) || null;
    const thumbnailUrl = (formData.get("thumbnailUrl") as string) || null;
    const published = formData.get("published") === "true";

    if (!title || !slug) {
      return { success: false, error: "Vui lòng nhập tiêu đề và slug" };
    }

    await prisma.newsPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        thumbnailUrl,
        published,
        publishedAt: published ? new Date() : null,
      },
    });

    revalidatePath("/news");
    revalidatePath("/admin/news");
    return { success: true };
  } catch (error) {
    console.error("Create news error:", error);
    return { success: false, error: "Slug đã tồn tại hoặc có lỗi xảy ra" };
  }
}

export async function updateNewsPost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = (formData.get("excerpt") as string) || null;
    const content = (formData.get("content") as string) || null;
    const thumbnailUrl = (formData.get("thumbnailUrl") as string) || null;
    const published = formData.get("published") === "true";

    await prisma.newsPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        thumbnailUrl,
        published,
        publishedAt: published ? new Date() : null,
      },
    });

    revalidatePath("/news");
    revalidatePath(`/news/${slug}`);
    revalidatePath("/admin/news");
    return { success: true };
  } catch (error) {
    console.error("Update news error:", error);
    return { success: false, error: "Có lỗi xảy ra khi cập nhật" };
  }
}
