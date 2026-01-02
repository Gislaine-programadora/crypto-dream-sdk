import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const chains = [
  { name: "Ethereum", color: "#627EEA" },
  { name: "Polygon", color: "#8247E5" },
  { name: "Solana", color: "#14F195" },
  { name: "BSC", color: "#F0B90B" },
  { name: "Avalanche", color: "#E84142" },
  { name: "Arbitrum", color: "#28A0F0" },
  { name: "Optimism", color: "#FF0420" },
  { name: "Base", color: "#0052FF" },
  { name: "Fantom", color: "#1969FF" },
  { name: "zkSync", color: "#8B8DFC" },
];

const IntegrationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="integrations" ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
            Integrações
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Uma API,
            <br />
            <span className="gradient-text">infinitas possibilidades</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conecte-se a mais de 50 blockchains com uma única integração. 
            Adicione novas redes sem modificar seu código.
          </p>
        </motion.div>

        {/* Chains Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto"
        >
          {chains.map((chain, index) => (
            <motion.div
              key={chain.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-xl p-6 text-center cursor-pointer group"
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110"
                style={{ backgroundColor: chain.color + "20", color: chain.color }}
              >
                {chain.name[0]}
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {chain.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* More chains indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8 text-muted-foreground"
        >
          + 40 mais blockchains suportadas
        </motion.p>
      </div>
    </section>
  );
};

export default IntegrationsSection;
