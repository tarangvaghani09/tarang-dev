import { motion } from "framer-motion";

const skillGroups = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "TailwindCSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "Authentication"],
  },
  {
    title: "Database",
    items: ["PostgreSQL", "MySQL", "Query Optimization"],
  },
  {
    title: "Architecture",
    items: ["System Design", "Scalable APIs", "Admin Dashboards"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Docker", "Postman"],
  },
  {
    title: "Dev Practices",
    items: [
      "Clean Code",
      "API Security",
      "Performance Optimization",
      "Responsive Design",
    ],
  },
];

export function SkillsSection() {
  return (
    <section id="expertise" className="py-24 relative">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Structured across frontend, backend, database, architecture, and
            engineering practices for production-ready applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="rounded-2xl border border-white/10 bg-secondary/25 backdrop-blur-sm p-5"
            >
              <h3 className="text-base md:text-lg font-semibold mb-3">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, itemIndex) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.05 + itemIndex * 0.04,
                    }}
                    className="text-xs md:text-sm px-2.5 py-1 rounded-full bg-white/5 text-muted-foreground border border-white/10"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

