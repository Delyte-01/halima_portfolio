// lib/projects-data.ts

export type ProjectCategory =
  | "All"
  | "Web"
  | "Mobile"
  | "Full-Stack"
  | "Database";

export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: ProjectCategory;
  demoLink: string;
  githubLink: string;
  stack?: string[];
  role?: string;
  year?: string;
  overview: string;
  challenges: string;
  technologies: string[];
  features: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "vaultix",
    title: "Vaultix",
    description: "A fully responsive wallet system with Paystack integration.",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783406301/vaultix-DXTsmUiU_d5ycdt.png",
    category: "Web",
    demoLink: "https://vaultix.vercel.app/",
    githubLink: "https://github.com/halimaarh/Vaultix",
    stack: ["React", "TypeScript", "Paystack"],
    role: "Front-End Developer",
    year: "2025",
    overview:
      "Vaultix is a digital wallet interface built to give users a fast, trustworthy way to manage balances and transactions. The focus was on making a financial product feel calm and legible rather than dense with numbers.",
    challenges:
      "Paystack's webhook timing meant the UI sometimes had to show a transaction as pending before confirmation arrived. I solved this with an optimistic-update pattern that reconciles silently once the webhook lands, so the interface never feels like it's lying to the user.",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Paystack API",
      "Framer Motion",
    ],
    features: [
      "Real-time balance updates with optimistic UI",
      "Transaction history with search and filters",
      "Secure PIN-based confirmation flow",
      "Responsive across mobile and desktop",
    ],
  },
  {
    slug: "fair-bay-city-bikes",
    title: "Fair Bay City Bikes — Case Study",
    description:
      "A case study on how MongoDB was used to design and implement a scalable bike-sharing system.",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783406314/MongoDB-CH8ZNslv_l0qwlr.png",
    category: "Database",
    demoLink: "#",
    githubLink: "https://github.com/halimaarh/city-bike-case-study",
    role: "Database Designer",
    year: "2024",
    overview:
      "This case study models the data layer for a citywide bike-sharing network — stations, bikes, rentals, and users — with an emphasis on query patterns that stay fast as station count grows into the thousands.",
    challenges:
      "The hardest part was modeling station capacity and bike availability without race conditions when two users try to rent the last bike at once. I used MongoDB's atomic findOneAndUpdate operations with conditional filters instead of a naive read-then-write.",
    technologies: ["MongoDB", "Node.js", "Express", "Mongoose"],
    features: [
      "Geospatial queries for nearest-station lookup",
      "Atomic rental transactions to prevent overbooking",
      "Aggregation pipelines for usage analytics",
      "Schema designed for horizontal scaling",
    ],
  },
  {
    slug: "netflix-clone",
    title: "Netflix Clone",
    description: "A Netflix interface clone built with React Native and Expo.",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783406325/netflix-DS5CD62G_t5lfv8.png",
    category: "Mobile",
    demoLink: "#",
    githubLink: "https://github.com/halimaarh/NETFLIX",
    role: "Mobile Developer",
    year: "2024",
    overview:
      "A pixel-level recreation of Netflix's mobile browsing experience — horizontally scrolling carousels, a hero banner, and a details modal — built to practice performant list rendering on mobile.",
    challenges:
      "Nested horizontal FlatLists inside a vertical scroll view caused jank on lower-end devices. Windowing and memoizing row components brought frame drops from noticeable to effectively none.",
    technologies: ["React Native", "Expo", "TMDB API"],
    features: [
      "Genre-based horizontal carousels",
      "Animated hero banner with autoplay preview",
      "Title details modal with cast and synopsis",
      "Persisted watchlist using local storage",
    ],
  },
  {
    slug: "bookstore",
    title: "Bookstore",
    description: "A full-stack bookstore app",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783406335/bookstore-CKPHil8V_hvgeze.png",
    category: "Web",
    demoLink: "https://book-store-iota-woad.vercel.app/",
    githubLink: "https://github.com/halimaarh/BookStore",
    role: "Frontend Developer",
    year: "2024",
    overview:
      "A pixel-level recreation of Netflix's mobile browsing experience — horizontally scrolling carousels, a hero banner, and a details modal — built to practice performant list rendering on mobile.",
    challenges:
      "Nested horizontal FlatLists inside a vertical scroll view caused jank on lower-end devices. Windowing and memoizing row components brought frame drops from noticeable to effectively none.",
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Context API",
    ],
    features: [
      "Responsive bookstore landing page",
      "Book catalog with search and filters",
      "Book details page",
      "Shopping cart interface",
      "Dark and light mode",
      "Smooth animations and transitions",
      "Mobile-first responsive design",
      "Reusable UI components",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
