import { blogPosts } from "@/data/blog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Portfolio`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 pb-16">
      <article className="container mx-auto px-4 max-w-3xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-black dark:hover:text-white mb-8 transition-colors"
        >
          &larr; Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            <time>{post.date}</time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </header>
        {/* Featured Image */}
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert prose-neutral max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
