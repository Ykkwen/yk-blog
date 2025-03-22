import { PrismaClient } from '.prisma/client'
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const prisma = new PrismaClient();
const postsDirectory = path.join(process.cwd(), "content/posts");

async function main() {
  console.log("Starting database seeding...");

  // Read all markdown files from the content/posts directory
  const fileNames = fs.readdirSync(postsDirectory);

  for (const fileName of fileNames) {
    // Get the file path
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Parse the markdown file
    const matterResult = matter(fileContents);
    const content = marked(matterResult.content);

    // Extract metadata
    const id = fileName.replace(/\.mdx$/, "");
    const title = matterResult.data.title;
    const date = new Date(matterResult.data.date);
    const description = matterResult.data.description;
    const tagsArray = matterResult.data.tags || [];
    const tags = tagsArray.join(",");
    const published = matterResult.data.published ?? true;

    // Check if post already exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (existingPost) {
      console.log(`Updating existing post: ${title}`);
      await prisma.post.update({
        where: { id },
        data: {
          title,
          date,
          description,
          content: content.toString(),
          tags,
          published,
        },
      });
    } else {
      console.log(`Creating new post: ${title}`);
      await prisma.post.create({
        data: {
          id,
          title,
          date,
          description,
          content: content.toString(),
          tags,
          published,
        },
      });
    }
  }

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
