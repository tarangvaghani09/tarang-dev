import { motion } from "framer-motion";
import { ArrowRight, Terminal, Server, Database, Network, Leaf } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 overflow-hidden"
    >
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Available for new opportunities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight mb-8"
          >
            Expert Full-Stack <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-glow">
              Developer.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12 font-sans"
          >
            I build secure, fast, and scalable admin dashboards, booking
            systems, and REST APIs using React, Node.js, and PostgreSQL. I
            deliver clean code, fast solutions, and business-ready features that
            save time and increase productivity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
            >
              View Projects <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 rounded-xl font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/5 transition-all duration-200"
            >
              Contact Me
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="font-medium">React & Next.js</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-accent" />
              <span className="font-medium">Node.js APIs</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              <span className="font-medium">REST APIs</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <span className="font-medium">PostgreSQL</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-accent" />
              <span className="font-medium">MongoDB</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
