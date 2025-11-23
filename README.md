# Portfolio Website

A modern, high-performance portfolio website built with the latest web technologies. This project showcases my work, skills, and thoughts through a clean and responsive interface.

## 🚀 Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Theming:** [next-themes](https://github.com/pacocoursey/next-themes)
-   **UI Library:** [React 19](https://react.dev/)

## ✨ Features

-   **Dynamic Blog:** A fully functional blog system with markdown support and dynamic routing (`/blog/[slug]`).
-   **Project Showcase:** A dedicated section to display projects with detailed views (`/projects/[slug]`).
-   **Responsive Design:** Optimized for all devices, from mobile phones to large desktop screens.
-   **Dark Mode:** Seamless dark/light mode switching.
-   **SEO Optimized:** Built-in SEO best practices with Next.js Metadata API.
-   **Performance:** Utilizes Next.js image optimization and static site generation (SSG) for blazing fast load times.

## 📂 Project Structure

```bash
src/
├── app/              # App Router pages and layouts
│   ├── about/        # About page
│   ├── blog/         # Blog listing and individual posts
│   ├── contact/      # Contact page
│   ├── projects/     # Projects listing and details
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # Reusable UI components
├── data/             # Static data files (blog posts, projects)
└── globals.css       # Global styles and Tailwind directives
```

## 🛠️ Getting Started

Follow these steps to run the project locally:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/portfolio-new.git
    cd portfolio-new
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 📦 Build & Deploy

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

This project is optimized for deployment on [Vercel](https://vercel.com/), the creators of Next.js.

## 📄 License

This project is licensed under the MIT License.
