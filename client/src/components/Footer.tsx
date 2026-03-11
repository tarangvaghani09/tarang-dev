import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-background">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xl">TARANG.</span>
          <span className="text-muted-foreground text-sm">© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        
        <div className="flex gap-6">
          <a href="https://github.com/tarangvaghani09" className="text-muted-foreground hover:text-primary transition-colors" target="_blank">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/in/tarang-vaghani-a1b0342b5" className="text-muted-foreground hover:text-primary transition-colors" target="_blank">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="https://twitter.com/tarangvaghani" className="text-muted-foreground hover:text-primary transition-colors" target="_blank">
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
