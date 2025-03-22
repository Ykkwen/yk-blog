import Link from "next/link";
import { format } from "date-fns";
import { getAllPosts, type PostMetadata } from "@/lib/mdx";
import { FiCalendar, FiArrowRight } from "react-icons/fi";

export default async function Home() {
  const posts: PostMetadata[] = await getAllPosts();
  console.log("xxxxxx=====>", posts);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 md:py-20">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          我的博客
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          分享技术、思考和创意
        </p>
      </header>

      <main>
        <section>
          <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-border flex items-center justify-between">
            <span>最新文章</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col card-hover bg-card rounded-lg overflow-hidden shadow-sm border border-border"
              >
                <Link href={`/posts/${post.id}`} className="group">
                  <div className="overflow-hidden">
                    <div className="h-48 bg-muted flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <span className="text-muted-foreground">文章封面</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-200 mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <FiCalendar className="mr-1" />
                      <time>
                        {format(new Date(post.date), "yyyy年MM月dd日")}
                      </time>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-primary font-medium group-hover:text-primary-hover transition-colors">
                      <span>阅读全文</span>
                      <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-20 pt-8 border-t border-border text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} 我的博客. 基于 Next.js 15 构建.</p>
      </footer>
    </div>
  );
}
