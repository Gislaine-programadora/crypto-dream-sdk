import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Zap, 
  Shield, 
  Globe, 
  Code2, 
  Layers, 
  Cpu,
  ArrowUpRight
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Ultra Rápido",
    description: "Latência sub-100ms com nossa infraestrutura distribuída globalmente. Processamento em tempo real para qualquer escala.",
    gradient: "from-primary to-cyan-400",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Segurança Enterprise",
    description: "Criptografia de ponta a ponta, auditorias regulares, e conformidade com SOC 2, GDPR e ISO 27001.",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "50+ Blockchains",
    description: "Suporte nativo para Ethereum, Polygon, Solana, BSC, Avalanche, Arbitrum e mais 45 redes.",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Developer First",
    description: "SDKs para TypeScript, Python, Go e Rust. Documentação completa e suporte 24/7.",
    gradient: "from-accent to-purple-400",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Smart Contracts",
    description: "Deploy, verificação e interação com contratos inteligentes de forma simplificada.",
    gradient: "from-orange-400 to-red-500",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "AI Powered",
    description: "Detecção de fraudes, otimização de gas e análise preditiva com machine learning.",
    gradient: "from-pink-400 to-rose-500",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
            Recursos
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Tudo que você precisa
            <br />
            <span className="gradient-text">em um só lugar</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Infraestrutura completa para construir, escalar e gerenciar 
            aplicações Web3 de classe mundial.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className="group glass rounded-2xl p-8 h-full cursor-pointer relative overflow-hidden"
  >
    {/* Hover gradient overlay */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
    
    {/* Icon */}
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 text-white`}>
      {icon}
    </div>

    {/* Content */}
    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
      {title}
      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </h3>
    <p className="text-muted-foreground leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default FeaturesSection;
