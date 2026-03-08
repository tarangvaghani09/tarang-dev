import { motion } from "framer-motion";
import { getProjectSlug, useProjects } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Github } from "lucide-react";

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();

  return (
    <section id="projects" className="py-32 relative bg-secondary/20 border-y border-white/5">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Featured Work</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              A selection of production-grade applications, admin panels, 
              and scalable APIs built for real business needs.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden p-2">
                <Skeleton className="w-full h-48 rounded-xl mb-6 bg-white/5" />
                <div className="p-4 space-y-4">
                  <Skeleton className="w-2/3 h-8 bg-white/5" />
                  <Skeleton className="w-full h-16 bg-white/5" />
                  <div className="flex gap-2">
                    <Skeleton className="w-16 h-6 rounded-full bg-white/5" />
                    <Skeleton className="w-16 h-6 rounded-full bg-white/5" />
                  </div>
                </div>
              </div>
            ))
          ) : projects?.length === 0 ? (
             <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed border-white/10 rounded-2xl">
               No projects published yet. Check back soon.
             </div>
          ) : (
            projects?.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group gradient-border rounded-2xl overflow-hidden bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden m-2 rounded-xl">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={project.images[0] || "/projects/api/cover.jpg"} 
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3 text-sm flex-grow">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span key={tech} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium border border-white/5">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-auto">
                    <a href={project.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                    <a href={`/projects/${getProjectSlug(project.title)}`} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                      <Github className="w-4 h-4" /> View Case Study
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
