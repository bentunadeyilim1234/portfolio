import { projects } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";

export default function Projects() {
  return (
    <section id="projects" className="py-16 md:py-24 container mx-auto px-4">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Bazı Projelerim</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-base">
          Göstermekten gurur duyduğum bazı projeler.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer block"
          >
            {/* Background Image */}
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-4 rounded-xl shadow-lg">
                <span className="text-xs font-medium text-white/80 mb-1 block">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {project.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
