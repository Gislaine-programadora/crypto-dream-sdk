import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold gradient-text">NexusSDK</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Infraestrutura Web3 de próxima geração para empresas que 
              constroem o futuro descentralizado.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Github size={20} />} />
              <SocialLink href="#" icon={<Twitter size={20} />} />
              <SocialLink href="#" icon={<Linkedin size={20} />} />
              <SocialLink href="#" icon={<MessageCircle size={20} />} />
            </div>
          </div>

          {/* Links */}
          <FooterColumn 
            title="Produto" 
            links={["Features", "Pricing", "API Docs", "SDKs", "Changelog"]} 
          />
          <FooterColumn 
            title="Empresa" 
            links={["Sobre", "Blog", "Carreiras", "Contato", "Partners"]} 
          />
          <FooterColumn 
            title="Legal" 
            links={["Privacidade", "Termos", "Segurança", "Compliance", "SLA"]} 
          />
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 NexusSDK. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Todos os sistemas operacionais
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <h4 className="font-semibold mb-4">{title}</h4>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link}>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
  >
    {icon}
  </motion.a>
);

export default Footer;
