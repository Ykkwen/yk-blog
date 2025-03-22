import { format } from "date-fns";
import { getPostData, type PostData } from "@/lib/mdx";
import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiTag } from "react-icons/fi";
import { Metadata } from "next";


type PostPageParams = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: PostPageParams): Promise<Metadata> {
  // 根据Next.js文档，在动态路由中使用params前需要等待它
  const resolveParams = await params;

  const id = resolveParams?.id;

  // 确保id是有效的
  if (!id) {
    return {
      title: "文章未找到",
      description: "请求的文章不存在",
    };
  }
  const postData = await getPostData(id);
  return {
    title: postData.title,
    description: postData.description,
  };
}

export default async function Post({ params }: PostPageParams): Promise<React.ReactElement> {
  // 根据Next.js文档，在动态路由中使用params前需要等待它
  const resolveParams = await params;
  const id = resolveParams.id;

  // 确保id是有效的
  if (!id) {
    return <div>文章未找到</div>;
  }
  const postData: PostData = await getPostData(id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center mb-8 text-sm text-primary hover:text-primary-hover transition-colors group"
      >
        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
        返回首页
      </Link>

      <article className="bg-card rounded-lg shadow-sm border border-border p-6 sm:p-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
            {postData.title}
          </h1>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <FiCalendar className="mr-1" />
            <time className="mr-4">
              {format(new Date(postData.date), "yyyy年MM月dd日")}
            </time>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {postData.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
              >
                <FiTag className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground italic">{postData.description}</p>
        </header>

        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    </div>
  );
}
