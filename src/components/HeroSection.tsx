import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Versão 3.0 disponível • Multichain Support
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            O SDK Web3
            <br />
            <span className="gradient-text">do Futuro</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
          >
            Infraestrutura blockchain de próxima geração. 
            Conecte qualquer rede, execute transações em milissegundos, 
            escale para milhões de usuários.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button variant="hero" size="xl">
              Começar Agora
              <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="xl">
              Ver Documentação
            </Button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <FeaturePill icon={<Zap size={16} />} text="< 100ms Latência" />
            <FeaturePill icon={<Shield size={16} />} text="Enterprise Security" />
            <FeaturePill icon={<Globe size={16} />} text="50+ Blockchains" />
          </motion.div>
        </div>

        {/* Code Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl p-1 glow-primary">
            <div className="bg-card rounded-xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-4 text-sm text-muted-foreground font-mono">
                  quickstart.ts
                </span>
              </div>
              
              {/* Code Content */}
              <pre className="p-6 text-sm md:text-base overflow-x-auto">
                <code className="font-mono">
                  <span className="text-accent">import</span>{" "}
                  <span className="text-foreground">{"{ NexusSDK }"}</span>{" "}
                  <span className="text-accent">from</span>{" "}
                  <span className="text-primary">'@nexus/web3-sdk'</span>
                  {"\n\n"}
                  <span className="text-muted-foreground">// Inicialize em segundos</span>
                  {"\n"}
                  <span className="text-accent">const</span>{" "}
                  <span className="text-foreground">nexus</span>{" "}
                  <span className="text-accent">=</span>{" "}
                  <span className="text-accent">new</span>{" "}
                  <span className="text-primary">NexusSDK</span>
                  <span className="text-foreground">({"{"}</span>
                  {"\n"}
                  <span className="text-foreground">  apiKey: </span>
                  <span className="text-primary">'sua-api-key'</span>
                  <span className="text-foreground">,</span>
                  {"\n"}
                  <span className="text-foreground">  network: </span>
                  <span className="text-primary">'ethereum'</span>
                  {"\n"}
                  <span className="text-foreground">{"})"}</span>
                  {"\n\n"}
                  <span className="text-muted-foreground">// Execute transações multichain</span>
                  {"\n"}
                  <span className="text-accent">const</span>{" "}
                  <span className="text-foreground">tx</span>{" "}
                  <span className="text-accent">=</span>{" "}
                  <span className="text-accent">await</span>{" "}
                  <span className="text-foreground">nexus.</span>
                  <span className="text-primary">send</span>
                  <span className="text-foreground">({"{"}</span>
                  {"\n"}
                  <span className="text-foreground">  to: </span>
                  <span className="text-primary">'0x...'</span>
                  <span className="text-foreground">,</span>
                  {"\n"}
                  <span className="text-foreground">  value: </span>
                  <span className="text-primary">'1.0'</span>
                  {"\n"}
                  <span className="text-foreground">{"})"}</span>
                </code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturePill = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
    <span className="text-primary">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export default HeroSection;
