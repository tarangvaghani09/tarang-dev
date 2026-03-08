import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema } from "@shared/schema";
import { useCreateMessage } from "@/hooks/use-messages";
import { useToast } from "@/hooks/use-toast";
import { Send, Mail, MapPin, Loader2 } from "lucide-react";
import { z } from "zod";

export function ContactSection() {
  const { toast } = useToast();
  const createMessage = useCreateMessage();
  
  const form = useForm<z.infer<typeof insertMessageSchema>>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    }
  });

  const onSubmit = (data: z.infer<typeof insertMessageSchema>) => {
    const slowRequestToastTimer = window.setTimeout(() => {
      toast({
        title: "Waking up server... grab a cup of coffee",
        description: "Initial request may take a moment as the server starts.",
      });
    }, 3000);

    createMessage.mutate(data, {
      onSuccess: () => {
        window.clearTimeout(slowRequestToastTimer);
        toast({
          title: "Message sent!",
          description: "Your message has been received. An email notification has also been sent to tarangvaghani@gmail.com.",
        });
        form.reset();
      },
      onError: (error) => {
        window.clearTimeout(slowRequestToastTimer);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Something went wrong.",
        });
      }
    });
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Let's build <br/><span className="text-primary">together.</span></h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-md">
              Looking for a dedicated developer to bring your vision to life? 
              I'm currently available for freelance projects and full-time roles.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center border border-white/5">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-foreground font-semibold">tarangvaghani@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center border border-white/5">
                  <MapPin className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-foreground font-semibold">Remote / Worldwide</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-8 rounded-3xl"
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Name</label>
                <input 
                  {...form.register("name")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="John Doe"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email</label>
                <input 
                  {...form.register("email")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="john@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Message</label>
                <textarea 
                  {...form.register("message")}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
                {form.formState.errors.message && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>

              <button 
                type="submit"
                disabled={createMessage.isPending}
                className="w-full px-6 py-4 rounded-xl font-bold bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {createMessage.isPending ? "Sending..." : "Send Message"}
                {createMessage.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
