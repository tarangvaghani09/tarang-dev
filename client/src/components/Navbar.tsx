import { animate, motion, type AnimationPlaybackControls } from "framer-motion";
import { Code2, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useRef, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const scrollAnimationRef = useRef<AnimationPlaybackControls | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = navRef.current?.offsetHeight ?? 72;
      const navOffset = navHeight + 16;
      const targetY = Math.max(
        0,
        element.getBoundingClientRect().top + window.scrollY - navOffset,
      );
      const fromY = window.scrollY;

      scrollAnimationRef.current?.stop();
      scrollAnimationRef.current = animate(fromY, targetY, {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => window.scrollTo(0, latest),
      });
    }
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        setIsNavbarVisible(true);
        lastScrollY = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      if (currentScrollY <= 8) {
        setIsNavbarVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <motion.nav 
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isNavbarVisible ? 0 : -100, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-card border-t-0 border-x-0 rounded-none"
    >
      <div className="flex items-center gap-2">
        <div className="hidden md:flex w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent items-center justify-center shadow-lg shadow-primary/20 cursor-pointer" onClick={() => scrollTo('hero')}>
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="md:hidden w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="border-r-0 shadow-2xl">
            <nav className="mt-10 flex flex-col gap-4">
              {["Expertise", "Projects", "Contact"].map((item) => (
                <SheetClose asChild key={item}>
                  <motion.button
                    onClick={() => scrollTo(item.toLowerCase())}
                    whileHover={{ y: -1, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="min-h-14 w-full text-left px-6 py-4 rounded-2xl text-xl font-semibold bg-white/70 text-[#1b1b1b] shadow-sm shadow-black/10 hover:bg-[#1b1b1b] hover:text-white active:scale-[0.98] transition-all duration-200 dark:bg-primary dark:text-white/90 dark:hover:bg-white dark:hover:text-[#111]"
                  >
                    {item}
                  </motion.button>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="font-display font-bold text-xl tracking-wide hover:text-foreground/90 transition-colors"
          aria-label="Scroll to top"
        >
          Tarang
        </button>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {['Expertise', 'Projects', 'Contact'].map((item) => (
          <button 
            key={item}
            onClick={() => scrollTo(item.toLowerCase())}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button 
          onClick={() => scrollTo('contact')}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-200"
        >
          Hire Me
        </button>
      </div>
    </motion.nav>
  );
}
