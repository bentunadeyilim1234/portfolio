import { blogPosts } from "@/data/blog";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function Blog() {
  redirect("/");
  return (
    <section id="blog" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Thoughts & Insights</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-base max-w-md">
              Writing about design, development, and the future of the web.
            </p>
          </div>
          <Link href="/blog" className="text-sm font-medium hover:underline underline-offset-4">
            View all posts &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col h-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                    {post.tags[0]}
                  </span>
                  <span className="text-xs text-neutral-500 py-1">{post.readTime}</span>
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 mb-4 flex-grow">
                  {post.excerpt}
                </p>

                <div className="text-xs text-neutral-500 mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  {post.date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
