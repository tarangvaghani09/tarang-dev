import { motion } from "framer-motion";

const skills = [
  "React.js", "Node.js", "PostgreSQL", "REST API", 
  "Admin Dashboard", "CRUD Applications", "TypeScript", 
  "TailwindCSS", "Next.js", "System Architecture"
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
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Technical Arsenal</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Specialized in modern web technologies, focusing on creating robust, 
            type-safe, and highly performant applications from front to back.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="px-6 py-3 rounded-full bg-secondary/50 border border-white/5 text-foreground font-medium hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
