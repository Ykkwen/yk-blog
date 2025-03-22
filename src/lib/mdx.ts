import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

// 导入数据库函数
import { getAllPostsFromDb, getPostIdsFromDb, getPostDataFromDb } from "./db";

const postsDirectory = path.join(process.cwd(), "content/posts");

// 环境变量，控制是否使用数据库
const USE_DATABASE = process.env.USE_DATABASE === "true";

export type PostMetadata = {
  id: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  published: boolean;
};

export type PostData = PostMetadata & {
  contentHtml: string | Promise<string>;
};

export type PostParams = {
  params: {
    id: string;
  };
};

export async function getPostIds(): Promise<PostParams[]> {
  // 如果使用数据库，则从数据库获取文章ID
  if (USE_DATABASE) {
    return getPostIdsFromDb();
  }

  // 否则从文件系统获取
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName: string) => {
    return {
      params: {
        id: fileName.replace(/\.mdx$/, ""),
      },
    };
  });
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  // 如果使用数据库，则从数据库获取文章
  if (USE_DATABASE) {
    const res = await getAllPostsFromDb();
    return res;
  }

  // 否则从文件系统获取
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName: string) => {
    // Remove ".mdx" from file name to get id
    const id = fileName.replace(/\.mdx$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      description: matterResult.data.description,
      tags: matterResult.data.tags || [],
      published: matterResult.data.published ?? true,
    } as PostMetadata;
  });

  // Sort posts by date
  return allPostsData
    .filter((post: PostMetadata) => post.published)
    .sort((a: PostMetadata, b: PostMetadata) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(id: string): Promise<PostData> {
  // 如果使用数据库，则从数据库获取文章
  if (USE_DATABASE) {
    return getPostDataFromDb(id);
  }

  // 否则从文件系统获取
  const fullPath = path.join(postsDirectory, `${id}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use marked to convert markdown into HTML string
  const contentHtml = marked(matterResult.content);

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    title: matterResult.data.title,
    date: matterResult.data.date,
    description: matterResult.data.description,
    tags: matterResult.data.tags || [],
    published: matterResult.data.published ?? true,
  };
}
