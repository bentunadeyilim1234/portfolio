import { projects } from "@/data/projects";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-black dark:hover:text-white mb-8 transition-colors"
        >
          &larr; Geri Dön
        </Link>

        {/* Hero Section */}
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-12 group">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-10">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl inline-block">
              <span className="text-sm font-medium text-white/90 mb-2 block">
                {project.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                {project.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Proje Hakkında</h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Kullanılan Teknolojiler</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
                Proje Detayları
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Durum</div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${project.status === 'Tamamlandı' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      project.status === 'Devam Ediyor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'
                    }
                  `}>
                    {project.status}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-neutral-500 mb-1">Başlangıç Tarihi</div>
                  <div className="text-sm font-medium">{project.developingSince}</div>
                </div>

                {project.link && (
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black text-center rounded-xl text-sm font-medium hover:scale-105 active:scale-95 transition-all"
                    >
                      Projeye Göz At
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
