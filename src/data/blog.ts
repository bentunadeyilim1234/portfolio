export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "future-of-web-design",
    title: "The Future of Web Design: Liquid Motion & Glassmorphism",
    date: "November 23, 2025",
    excerpt: "Exploring the next generation of user interfaces, focusing on fluid animations, depth, and the resurgence of skeuomorphic elements in modern design.",
    content: `
      <p>Web design is constantly evolving, and as we move further into the mid-2020s, we're seeing a fascinating shift towards more organic, fluid, and depth-oriented interfaces. The flat design era is behind us, replaced by a desire for tactile, almost physical digital experiences.</p>
      
      <h2>The Rise of Liquid Motion</h2>
      <p>Liquid motion refers to animations that feel natural, viscous, and responsive. Unlike the linear transitions of the past, these animations mimic the physics of real-world fluids. They add a layer of delight and polish that makes applications feel alive.</p>
      
      <h2>Glassmorphism 2.0</h2>
      <p>Glassmorphism isn't new, but it's maturing. We're moving beyond simple blurs to complex, multi-layered refractions that create a true sense of depth. By combining variable blur radii, noise textures, and subtle border highlights, we can create interfaces that feel like they're crafted from premium materials.</p>
      
      <h2>Why It Matters</h2>
      <p>These trends aren't just about aesthetics; they're about usability. Depth cues help users understand hierarchy. Motion guides the eye and provides feedback. When used correctly, these elements reduce cognitive load and make complex applications feel intuitive.</p>
    `,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    readTime: "5 min read",
    tags: ["Design", "UI/UX", "Trends"],
  },
  {
    slug: "mastering-tailwind-v4",
    title: "Mastering Tailwind CSS v4: What's New and Improved",
    date: "November 15, 2025",
    excerpt: "A deep dive into the new features, performance improvements, and the revolutionary Oxide engine that powers the latest version of Tailwind CSS.",
    content: `
      <p>Tailwind CSS v4 is a game-changer. With the new Oxide engine, build times are practically instant, and the developer experience has been streamlined significantly. Let's explore the key features that make this release so special.</p>
      
      <h2>Zero-Configuration</h2>
      <p>Gone are the days of complex \`tailwind.config.js\` files. Tailwind v4 detects your content files automatically and infers your configuration. This "zero-config" approach lowers the barrier to entry and speeds up project scaffolding.</p>
      
      <h2>Native CSS Variables</h2>
      <p>Tailwind v4 leans heavily into native CSS variables, making it easier than ever to implement dynamic themes, dark modes, and complex color palettes without leaving your CSS file.</p>
      
      <h2>The Future is Rust</h2>
      <p>By rewriting the core engine in Rust, the Tailwind team has achieved performance gains that were previously thought impossible. Large projects that used to take seconds to rebuild now update in milliseconds.</p>
    `,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    readTime: "8 min read",
    tags: ["Development", "CSS", "Tailwind"],
  },
  {
    slug: "building-accessible-web-apps",
    title: "Building for Accessibility: A Developer's Guide",
    date: "November 02, 2025",
    excerpt: "Why inclusive design is not just a requirement, but a necessity. Practical tips for building web applications that work for everyone.",
    content: `
      <p>Accessibility (a11y) is often treated as an afterthought, a box to check before launch. But building accessible web applications is fundamental to the spirit of the open web. It ensures that everyone, regardless of ability, can access and interact with your content.</p>
      
      <h2>Semantic HTML</h2>
      <p>The foundation of accessibility is semantic HTML. Using the correct tags (\`<button>\`, \`<nav>\`, \`<main>\`) gives screen readers the context they need to navigate your site effectively. It's the simplest, most high-impact change you can make.</p>
      
      <h2>Keyboard Navigation</h2>
      <p>Can you use your site without a mouse? Ensure that all interactive elements are focusable and that the focus state is clearly visible. This benefits not only users with motor impairments but also power users who prefer keyboard shortcuts.</p>
      
      <h2>Color Contrast</h2>
      <p>Low contrast text is a major barrier for users with visual impairments. Tools like the WebAIM Contrast Checker should be part of your design workflow from day one. Aim for a contrast ratio of at least 4.5:1 for normal text.</p>
    `,
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
    readTime: "6 min read",
    tags: ["Accessibility", "Development", "Best Practices"],
  },
];
