export const projects = [
  {
    id: 1,
    title: "Real-Time Booking System",
    description:
      "A fast and secure booking platform allowing users to schedule appointments in real-time.",
    images: [
      "/projects/booking/cover.jpg"
    ],
    tech: ["React", "Node.js", "PostgreSQL"],
    live: "https://chat-demo.vercel.app",
    github: "https://github.com/yourname/chat-app"
  },
  {
    id: 2,
    title: "Admin Dashboard",
    description:
      "A scalable admin dashboard for managing users, roles, and viewing analytics data.",
    images: [
      "/projects/admin/cover.jpg"
    ],
    tech: ["React", "Express", "Recharts"],
    live: "https://booking-demo.vercel.app",
    github: "https://github.com/yourname/room-booking"
  },
  {
    id: 3,
    title: "E-Commerce REST API",
    description:
      "A business-ready REST API for an e-commerce platform with fast query performance and clean code.",
    images: [
      "/projects/api/cover.jpg"
    ],
    tech: ["Node.js", "Express", "PostgreSQL"],
    live: "https://dashboard-demo.vercel.app",
    github: "https://github.com/yourname/admin-dashboard"
  }
];

export function getProjectSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function useProjects() {
  return {
    data: projects,
    isLoading: false,
  };
}
