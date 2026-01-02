import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <span className="text-primary-foreground font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold gradient-text">NexusSDK</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#features">Recursos</NavLink>
            <NavLink href="#integrations">Integrações</NavLink>
            <NavLink href="#pricing">Preços</NavLink>
            <NavLink href="#docs">Docs</NavLink>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button variant="hero" size="sm">
              Começar Grátis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pt-4 pb-2"
          >
            <div className="flex flex-col gap-4">
              <NavLink href="#features" mobile>Recursos</NavLink>
              <NavLink href="#integrations" mobile>Integrações</NavLink>
              <NavLink href="#pricing" mobile>Preços</NavLink>
              <NavLink href="#docs" mobile>Docs</NavLink>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="ghost" size="sm">Login</Button>
                <Button variant="hero" size="sm">Começar Grátis</Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

const NavLink = ({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) => (
  <a
    href={href}
    className={`text-muted-foreground hover:text-primary transition-colors duration-300 ${mobile ? 'text-lg' : 'text-sm font-medium'}`}
  >
    {children}
  </a>
);

export default Navbar;
