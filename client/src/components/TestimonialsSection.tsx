import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    text: "Tarang delivered a high-performance booking system with a clean UI and scalable backend. Communication was smooth and the project was completed ahead of schedule.",
    role: "Founder",
    companyType: "SaaS Startup",
  },
  {
    id: 2,
    text: "Excellent full-stack developer. The admin dashboard and APIs were well-structured, fast, and easy to maintain. Highly recommended for serious projects.",
    role: "Product Manager",
    companyType: "Tech Company",
  },
  {
    id: 3,
    text: "Clean code, strong backend architecture, and great attention to detail. The system performs smoothly even under heavy usage.",
    role: "CTO",
    companyType: "Software Company",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 relative">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Client Feedback</h2>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Trusted by founders, product teams, and businesses to build reliable web
            applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6"
            >
              <div className="text-yellow-400 tracking-wide text-base mb-4">★★★★★</div>
              <p className="text-foreground leading-7 mb-6">"{item.text}"</p>
              <div>
                <p className="text-white font-semibold">{item.role}</p>
                <p className="text-gray-400 text-sm">{item.companyType}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
