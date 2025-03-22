import { prisma } from "./prisma";
import { PostData, PostMetadata, PostParams } from "./mdx";

/**
 * 获取所有博客文章的元数据
 * 从数据库中获取所有已发布的文章，并按日期排序
 */
export async function getAllPostsFromDb(): Promise<PostMetadata[]> {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      date: "desc",
    },
    select: {
      id: true,
      title: true,
      date: true,
      description: true,
      tags: true,
      published: true,
    },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    date: post.date.toISOString(),
    description: post.description,
    tags: post.tags ? post.tags.split(",") : [],
    published: post.published,
  }));
}

/**
 * 获取所有文章ID
 * 用于静态生成页面
 */
export async function getPostIdsFromDb(): Promise<PostParams[]> {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });

  return posts.map((post) => ({
    params: {
      id: post.id,
    },
  }));
}

/**
 * 获取单篇文章的完整数据
 * @param id 文章ID
 */
export async function getPostDataFromDb(id: string): Promise<PostData> {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    throw new Error(`Post with id ${id} not found`);
  }

  return {
    id: post.id,
    title: post.title,
    date: post.date.toISOString(),
    description: post.description,
    tags: post.tags ? post.tags.split(",") : [],
    published: post.published,
    contentHtml: post.content,
  };
}
