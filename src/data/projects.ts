export interface Project {
  slug: string;
  title: string;
  category: string;
  image: string;
  status: "Tamamlandı" | "Devam Ediyor" | "Arşivlendi";
  developingSince: string;
  description: string;
  technologies: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    slug: "e-commerce",
    title: "MONO: Modern E-Ticaret Sitesi",
    category: "Web Sitesi Geliştirme",
    image: "/ecommerce.png",
    status: "Devam Ediyor",
    developingSince: "Kasım 2025",
    description: "MONO, React'ın getirdiği esneklik ile Tailwind CSS'in sağladığı modern tasarım anlayışını birleştirerek harika bir tasarım örneği olmuştur.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    link: "https://v0-shopping-site-design-lyart.vercel.app/",
  },
  {
    slug: "kaygi-asistani",
    title: "Kaygı Asistanı",
    category: "Web Sitesi Geliştirme",
    image: "/kaygi-asistani.png",
    status: "Devam Ediyor",
    developingSince: "Ağustos 2024",
    description: "TÜBİTAK yarışmaları için geliştirmeye başlamış olduğum bu proje, kaygıya sahip hastaları görevlendirerek oyun bazlı kendilerini daha iyi hissetmelerini sağlamayı hedeflemektedir.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    link: "https://kaygi-asistani.vercel.app/",
  },
];
