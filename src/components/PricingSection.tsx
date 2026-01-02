import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfeito para começar",
    price: "Grátis",
    period: "",
    features: [
      "1M requisições/mês",
      "5 redes blockchain",
      "API básica",
      "Suporte comunidade",
      "Dashboard analytics",
    ],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    name: "Pro",
    description: "Para projetos em crescimento",
    price: "$99",
    period: "/mês",
    features: [
      "50M requisições/mês",
      "Todas as 50+ redes",
      "APIs avançadas",
      "Suporte prioritário 24/7",
      "Webhooks ilimitados",
      "AI fraud detection",
    ],
    cta: "Começar Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Para grandes operações",
    price: "Custom",
    period: "",
    features: [
      "Requisições ilimitadas",
      "Redes privadas",
      "SLA 99.99%",
      "Account manager dedicado",
      "Integração customizada",
      "On-premise disponível",
    ],
    cta: "Falar com Vendas",
    popular: false,
  },
];

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" ref={ref} className="py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
            Preços
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Planos que
            <br />
            <span className="gradient-text">escalam com você</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece gratuitamente e escale conforme seu projeto cresce. 
            Sem surpresas, sem custos ocultos.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-primary to-accent px-4 py-1 rounded-full text-primary-foreground text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Mais Popular
                  </div>
                </div>
              )}
              
              <div className={`glass rounded-2xl p-8 h-full flex flex-col ${plan.popular ? 'ring-2 ring-primary glow-primary' : ''}`}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  size="lg" 
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
