import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Briefcase,
  Globe,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Mail,
  Linkedin,
  Calendar,
  Play,
  Pause
} from "lucide-react";
import { toast } from "sonner";

// Datos de métricas de tracción (simulados para demo)
const tractionMetrics = {
  users: { current: 12847, growth: 340, label: "Usuarios Activos" },
  companies: { current: 47, growth: 12, label: "Empresas Clientes" },
  transactions: { current: 284650, growth: 15420, label: "Transacciones/Mes" },
  gmv: { current: 2340000, growth: 180000, label: "GMV Mensual (USD)" },
  retention: { current: 94, growth: 3, label: "Retención (%)" },
  nps: { current: 72, growth: 8, label: "NPS Score" }
};

// Slides del pitch deck
const pitchSlides = [
  {
    id: 1,
    title: "El Problema",
    subtitle: "Crisis de Bienestar Financiero en LATAM",
    content: [
      "78% de empleados en LATAM viven al día",
      "El estrés financiero causa 15% de ausentismo laboral",
      "Las empresas pierden $500B/año en productividad",
      "Los préstamos informales tienen tasas del 200%+ anual"
    ],
    stat: { value: "$500B", label: "Pérdida anual en productividad" },
    color: "red"
  },
  {
    id: 2,
    title: "La Solución",
    subtitle: "Treevü: El Sistema Operativo del Bienestar Financiero",
    content: [
      "FWI Score: Medición científica del bienestar financiero",
      "EWA: Adelanto de salario sin intereses ni deuda",
      "IA Predictiva: Alertas tempranas de riesgo financiero",
      "Marketplace: Descuentos exclusivos para empleados"
    ],
    stat: { value: "3 en 1", label: "Plataforma integral B2B2C" },
    color: "green"
  },
  {
    id: 3,
    title: "Modelo de Negocio",
    subtitle: "SaaS B2B + Marketplace Fees",
    content: [
      "Suscripción mensual por empleado: $2-5 USD",
      "Comisión por transacción EWA: 1.5%",
      "Fee de marketplace: 3-8% por venta",
      "Servicios premium: Reportes, integraciones"
    ],
    stat: { value: "$45", label: "LTV promedio por usuario" },
    color: "blue"
  },
  {
    id: 4,
    title: "Tracción",
    subtitle: "Crecimiento Exponencial",
    content: [
      "47 empresas clientes en 8 meses",
      "12,847 usuarios activos mensuales",
      "$2.3M GMV mensual procesado",
      "94% retención de clientes"
    ],
    stat: { value: "340%", label: "Crecimiento YoY" },
    color: "purple"
  },
  {
    id: 5,
    title: "Mercado",
    subtitle: "TAM/SAM/SOM en LATAM",
    content: [
      "TAM: $180B (Bienestar financiero global)",
      "SAM: $12B (LATAM corporativo)",
      "SOM: $800M (Empresas 100-5000 empleados)",
      "Expansión: México, Colombia, Chile, Perú"
    ],
    stat: { value: "$12B", label: "Mercado direccionable" },
    color: "orange"
  },
  {
    id: 6,
    title: "Competencia",
    subtitle: "Ventaja Competitiva Sostenible",
    content: [
      "Único con FWI Score propietario",
      "Integración nativa con nóminas LATAM",
      "IA entrenada con datos regionales",
      "Network effects del marketplace"
    ],
    stat: { value: "18 meses", label: "Ventaja tecnológica" },
    color: "cyan"
  },
  {
    id: 7,
    title: "Equipo",
    subtitle: "Founders con Track Record",
    team: [
      { name: "CEO", role: "Ex-Rappi, MBA Stanford", avatar: "👨‍💼" },
      { name: "CTO", role: "Ex-Nubank, 15 años fintech", avatar: "👩‍💻" },
      { name: "COO", role: "Ex-Kavak, Ops LATAM", avatar: "👨‍💼" },
      { name: "CFO", role: "Ex-Goldman, Series B+", avatar: "👩‍💼" }
    ],
    stat: { value: "50+", label: "Años de experiencia combinada" },
    color: "indigo"
  },
  {
    id: 8,
    title: "Roadmap",
    subtitle: "Plan de Expansión 2024-2026",
    milestones: [
      { year: "2024 Q4", item: "100 empresas, $5M ARR" },
      { year: "2025 Q2", item: "Expansión México y Colombia" },
      { year: "2025 Q4", item: "500 empresas, $15M ARR" },
      { year: "2026", item: "IPO readiness, $50M ARR" }
    ],
    stat: { value: "$50M", label: "ARR objetivo 2026" },
    color: "emerald"
  },
  {
    id: 9,
    title: "La Ronda",
    subtitle: "Serie A - $8M USD",
    content: [
      "Uso de fondos: 40% Tech, 35% GTM, 25% Ops",
      "Runway: 24 meses",
      "Objetivo: 500 empresas, 100K usuarios",
      "Valoración pre-money: $32M"
    ],
    stat: { value: "$8M", label: "Levantando Serie A" },
    color: "green"
  }
];

// Componente de contador animado
function AnimatedCounter({ value, prefix = "", suffix = "", duration = 2000 }: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  return (
    <span>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}

export default function InvestorPitch() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    fund: "",
    message: ""
  });

  // Auto-play slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % pitchSlides.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % pitchSlides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + pitchSlides.length) % pitchSlides.length);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("¡Mensaje enviado!", {
      description: "Nuestro equipo de inversiones te contactará pronto."
    });
    setShowContactForm(false);
    setContactForm({ name: "", email: "", fund: "", message: "" });
  };

  const slide = pitchSlides[currentSlide];

  const colorClasses: Record<string, string> = {
    red: "from-red-500/20 to-red-600/5 border-red-500/30",
    green: "from-green-500/20 to-green-600/5 border-green-500/30",
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
    orange: "from-orange-500/20 to-orange-600/5 border-orange-500/30",
    cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30",
    indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/30",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl">Treevü</span>
            <span className="text-xs text-gray-400 ml-2">Investor Deck</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={() => setShowContactForm(true)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Call
            </Button>
            <Button 
              size="sm"
              className="bg-green-500 hover:bg-green-600"
              onClick={() => toast.info("Descarga disponible próximamente")}
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm mb-6">
              <Zap className="w-4 h-4" />
              Serie A - Levantando $8M USD
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              El Sistema Operativo del
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500"> Bienestar Financiero</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Transformamos la relación entre empresas y empleados con tecnología que mejora 
              la salud financiera, reduce el ausentismo y aumenta la productividad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Métricas de Tracción */}
      <section className="py-12 px-4 border-y border-white/10 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(tractionMetrics).map(([key, metric], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4"
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  <AnimatedCounter 
                    value={metric.current} 
                    prefix={key === "gmv" ? "$" : ""} 
                    suffix={key === "retention" || key === "nps" ? "" : ""}
                  />
                  {key === "retention" && "%"}
                </div>
                <div className="text-xs text-gray-400">{metric.label}</div>
                <div className="text-xs text-green-400 mt-1">
                  +{metric.growth} este mes
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pitch Deck Interactivo */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Pitch Deck Interactivo</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="border-white/20"
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <span className="text-sm text-gray-400">
                {currentSlide + 1} / {pitchSlides.length}
              </span>
            </div>
          </div>

          {/* Slide actual */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`bg-gradient-to-br ${colorClasses[slide.color]} border min-h-[400px]`}>
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Contenido principal */}
                    <div className="flex-1">
                      <div className="text-sm text-gray-400 mb-2">Slide {slide.id}</div>
                      <h3 className="text-3xl font-bold mb-2">{slide.title}</h3>
                      <p className="text-lg text-gray-300 mb-6">{slide.subtitle}</p>
                      
                      {slide.content && (
                        <ul className="space-y-3">
                          {slide.content.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      )}

                      {slide.team && (
                        <div className="grid grid-cols-2 gap-4">
                          {slide.team.map((member, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                            >
                              <span className="text-3xl">{member.avatar}</span>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-xs text-gray-400">{member.role}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {slide.milestones && (
                        <div className="space-y-3">
                          {slide.milestones.map((milestone, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-4 p-3 rounded-lg bg-white/5"
                            >
                              <div className="text-sm font-medium text-green-400 w-20">{milestone.year}</div>
                              <ArrowRight className="w-4 h-4 text-gray-500" />
                              <div>{milestone.item}</div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Estadística destacada */}
                    <div className="lg:w-64 flex flex-col items-center justify-center p-6 rounded-xl bg-white/5">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className="text-5xl font-bold text-white mb-2"
                      >
                        {slide.stat.value}
                      </motion.div>
                      <div className="text-sm text-gray-400 text-center">{slide.stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navegación */}
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={prevSlide} className="border-white/20">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            {/* Indicadores */}
            <div className="flex gap-2">
              {pitchSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlide ? "w-8 bg-green-500" : "bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            
            <Button variant="outline" onClick={nextSlide} className="border-white/20">
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-green-500/10">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para transformar el bienestar financiero?</h2>
          <p className="text-gray-400 mb-8">
            Únete a los inversores que están apostando por el futuro del trabajo en LATAM.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-600"
              onClick={() => setShowContactForm(true)}
            >
              <Mail className="w-5 h-5 mr-2" />
              Contactar al Equipo
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/20"
              onClick={() => window.open("https://linkedin.com", "_blank")}
            >
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn del Equipo
            </Button>
          </div>
        </div>
      </section>

      {/* Modal de Contacto */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Contactar al Equipo de Inversiones</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Nombre completo</label>
                  <Input
                    value={contactForm.name}
                    onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Tu nombre"
                    required
                    className="bg-white/5 border-white/10"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="tu@email.com"
                    required
                    className="bg-white/5 border-white/10"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Fondo / Firma</label>
                  <Input
                    value={contactForm.fund}
                    onChange={e => setContactForm(prev => ({ ...prev, fund: e.target.value }))}
                    placeholder="Nombre del fondo"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Mensaje</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="¿Qué te gustaría saber?"
                    rows={3}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowContactForm(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                    Enviar
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© 2024 Treevü. Confidencial - Solo para inversores calificados.</p>
          <p className="mt-2">Este documento no constituye una oferta de valores.</p>
        </div>
      </footer>
    </div>
  );
}
