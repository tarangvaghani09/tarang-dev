import { getProjectSlug, projects } from "@/hooks/use-projects";

export type ProjectCaseStudy = {
  slug: string;
  title: string;
  shortDescription: string;
  live: string;
  github: string;
  heroImage: string;
  problem: string;
  solution: string;
  keyFeatures: string[];
  techStack: {
    frontend: string;
    backend: string;
    database: string;
    deployment: string;
  };
  gallery: { label: string; image: string }[];
};

const heroByTitle: Record<string, string> = Object.fromEntries(
  projects.map((p) => [p.title, p.images[0]]),
);

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    slug: getProjectSlug("Real-Time Booking System"),
    title: "Real-Time Booking System",
    shortDescription:
      "A scalable booking platform built with React, Node.js, and PostgreSQL supporting real-time availability.",
    live: "https://chat-demo.vercel.app",
    github: "https://github.com/yourname/chat-app",
    heroImage: heroByTitle["Real-Time Booking System"],
    problem:
      "Many small hotels and coworking spaces manage bookings manually which causes double booking and scheduling conflicts.",
    solution:
      "I built a real-time booking system that allows users to check availability, reserve rooms, and manage bookings through an admin dashboard.",
    keyFeatures: [
      "Real-time room availability",
      "Booking calendar",
      "Admin dashboard",
      "Booking approval system",
      "Email confirmation",
      "Secure authentication",
    ],
    techStack: {
      frontend: "React + Tailwind",
      backend: "Node.js + Express",
      database: "PostgreSQL",
      deployment: "Vercel + Railway",
    },
    gallery: [
      { label: "Dashboard", image: heroByTitle["Real-Time Booking System"] },
      { label: "Booking Calendar", image: "/projects/booking/booking-calendar.jpg" },
      { label: "Admin Panel", image: "/projects/booking/admin-panel.jpg" },
      { label: "Analytics", image: "/projects/booking/analytics.jpg" },
    ],
  },
  {
    slug: getProjectSlug("Admin Dashboard"),
    title: "Admin Dashboard",
    shortDescription:
      "A scalable admin dashboard built with React and Express for role management, analytics, and operational visibility.",
    live: "https://booking-demo.vercel.app",
    github: "https://github.com/yourname/room-booking",
    heroImage: heroByTitle["Admin Dashboard"],
    problem:
      "Operations teams often rely on scattered tools and spreadsheets, resulting in delayed decisions and poor visibility across metrics.",
    solution:
      "I developed a centralized dashboard to track analytics, manage users and roles, and monitor activity with clear visual reports.",
    keyFeatures: [
      "Role-based access controls",
      "Analytics overview widgets",
      "User and permission management",
      "Search and filters",
      "Responsive layout",
      "Activity monitoring",
    ],
    techStack: {
      frontend: "React + Tailwind",
      backend: "Node.js + Express",
      database: "PostgreSQL",
      deployment: "Vercel + Railway",
    },
    gallery: [
      { label: "Dashboard", image: heroByTitle["Admin Dashboard"] },
      { label: "User Management", image: "/projects/admin/user-management.jpg" },
      { label: "Admin Panel", image: "/projects/admin/admin-panel.jpg" },
      { label: "Reports", image: "/projects/admin/reports.jpg" },
    ],
  },
  {
    slug: getProjectSlug("E-Commerce REST API"),
    title: "E-Commerce REST API",
    shortDescription:
      "A business-ready API built with Node.js and Express for fast e-commerce operations and clean maintainable service architecture.",
    live: "https://dashboard-demo.vercel.app",
    github: "https://github.com/yourname/admin-dashboard",
    heroImage: heroByTitle["E-Commerce REST API"],
    problem:
      "Growing e-commerce products need stable and fast APIs, but inconsistent endpoints and poor query performance create bottlenecks.",
    solution:
      "I designed and implemented a structured REST API with optimized query patterns, modular services, and robust validation.",
    keyFeatures: [
      "RESTful endpoint design",
      "Fast database querying",
      "Structured validation",
      "Authentication middleware",
      "Clear error handling",
      "Scalable service modules",
    ],
    techStack: {
      frontend: "React + Tailwind",
      backend: "Node.js + Express",
      database: "PostgreSQL",
      deployment: "Vercel + Railway",
    },
    gallery: [
      { label: "API Overview", image: heroByTitle["E-Commerce REST API"] },
      { label: "Order Endpoints", image: "/projects/api/order-endpoints.jpg" },
      { label: "Admin Panel", image: "/projects/api/admin-panel.jpg" },
      { label: "Analytics", image: "/projects/api/analytics.jpg" },
    ],
  },
];

export function getCaseStudyBySlug(slug: string) {
  return projectCaseStudies.find((item) => item.slug === slug);
}
