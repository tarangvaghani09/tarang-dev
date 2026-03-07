import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getCaseStudyBySlug } from "@/data/project-case-studies";

function sectionTitle(title: string) {
  return <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>;
}

export default function ProjectCaseStudy() {
  const [location, setLocation] = useLocation();
  const slug = location.split("/projects/")[1] ?? "";
  const project = getCaseStudyBySlug(slug);

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    setLocation("/");
  };

  if (!project) {
    return (
      <main className="min-h-screen bg-background text-foreground p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Project not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <motion.button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        <motion.section
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{project.shortDescription}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Live Demo
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-border hover:bg-secondary transition-colors"
            >
              Github
            </a>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
        >
          <img
            src={project.heroImage}
            alt={`${project.title} screenshot`}
            className="w-full max-h-[560px] object-cover rounded-2xl border border-white/10"
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35 }}
        >
          {sectionTitle("Problem")}
          <p className="text-muted-foreground leading-7">{project.problem}</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35 }}
        >
          {sectionTitle("Solution")}
          <p className="text-muted-foreground leading-7">{project.solution}</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35 }}
        >
          {sectionTitle("Key Features")}
          <ul className="space-y-2 text-muted-foreground">
            {project.keyFeatures.map((feature) => (
              <li key={feature}>- {feature}</li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35 }}
        >
          {sectionTitle("Tech Stack")}
          <div className="space-y-2 text-muted-foreground">
            <p>Frontend: {project.techStack.frontend}</p>
            <p>Backend: {project.techStack.backend}</p>
            <p>Database: {project.techStack.database}</p>
            <p>Deployment: {project.techStack.deployment}</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
        >
          {sectionTitle("Screenshots Gallery")}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.gallery.map((item, index) => (
              <motion.figure
                key={item.label}
                className="rounded-xl border border-white/10 overflow-hidden bg-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-56 object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">{item.label}</figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
