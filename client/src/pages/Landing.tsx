import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { motion, useInView, Variants } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { 
  Leaf, TrendingUp, Shield, Users, Wallet, Gift, 
  BarChart3, Building2, Star, CheckCircle2, ArrowRight,
  Sparkles, Heart, Clock, DollarSign, ChevronRight, Loader2
} from "lucide-react";
import { Link } from "wouter";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Animated Section Component
function AnimatedSection({ children, className = "" }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    employeeCount: "",
  });

  const submitDemo = trpc.contact.submitDemoRequest.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("¡Solicitud enviada! Te contactaremos pronto.");
        setFormData({ firstName: "", lastName: "", email: "", company: "", employeeCount: "" });
      } else {
        toast.error("Error al enviar. Intenta de nuevo.");
      }
    },
    onError: () => toast.error("Error al enviar. Verifica los datos."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    submitDemo.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Treevü
            </span>
          </motion.div>
          <div className="hidden md:flex items-center space-x-8">
            {['Características', 'Beneficios', 'Testimonios', 'Precios'].map((item, i) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-600 hover:text-green-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/app">
              <Button variant="ghost" className="text-gray-600">
                Iniciar Sesión
              </Button>
            </Link>
            <motion.a 
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600">
                Solicitar Demo
              </Button>
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden relative">
        <motion.div 
          className="absolute top-20 right-0 w-96 h-96 bg-green-200 rounded-full filter blur-3xl opacity-30"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200 rounded-full filter blur-3xl opacity-30"
          animate={{ 
            scale: [1, 1.3, 1],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full"
              >
                <Sparkles className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">
                  Plataforma #1 en Bienestar Financiero
                </span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Transforma el{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  bienestar financiero
                </span>{" "}
                de tu equipo
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Treevü es la plataforma integral que ayuda a tus empleados a mejorar su salud financiera, 
                reduciendo el estrés y aumentando la productividad. Adelantos de salario, 
                educación financiera y recompensas en un solo lugar.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a 
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-lg px-8 py-6">
                    Solicitar Demo Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.a>
                <motion.a 
                  href="#características"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-green-200 hover:bg-green-50">
                    Ver Características
                  </Button>
                </motion.a>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="flex items-center space-x-8 pt-4"
              >
                {[
                  { value: "50K+", label: "Empleados activos" },
                  { value: "200+", label: "Empresas" },
                  { value: "35%", label: "Menos rotación" },
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div 
                className="bg-white rounded-3xl shadow-2xl p-8"
                whileHover={{ rotate: 0 }}
                initial={{ rotate: 2 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Tu FWI Score</p>
                    <motion.p 
                      className="text-4xl font-bold text-green-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      78
                    </motion.p>
                  </div>
                  <motion.div 
                    className="bg-green-100 p-3 rounded-full"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </motion.div>
                </div>
                <motion.div 
                  className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden"
                >
                  <motion.div 
                    className="h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  />
                </motion.div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Wallet, label: "EWA", value: "$800", color: "green" },
                    { icon: Gift, label: "TreePoints", value: "450", color: "purple" },
                    { icon: BarChart3, label: "Metas", value: "3/5", color: "blue" },
                  ].map((item, i) => (
                    <motion.div 
                      key={item.label}
                      className={`bg-${item.color}-50 p-3 rounded-xl text-center`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <item.icon className={`h-6 w-6 text-${item.color}-600 mx-auto mb-1`} />
                      <p className="text-xs text-gray-600">{item.label}</p>
                      <p className={`font-semibold text-${item.color}-600`}>{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Floating cards */}
              <motion.div 
                className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Meta alcanzada!</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">+50 TreePoints</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <p className="text-center text-gray-500 mb-8">Empresas que confían en Treevü</p>
          </AnimatedSection>
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-12 opacity-60"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {['Empresa A', 'Empresa B', 'Empresa C', 'Empresa D', 'Empresa E'].map((company, i) => (
              <motion.div 
                key={i} 
                className="text-2xl font-bold text-gray-400"
                variants={scaleIn}
              >
                {company}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="características" className="py-20 px-4">
        <div className="container mx-auto">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para el{" "}
              <span className="text-green-600">bienestar financiero</span>
            </h2>
            <p className="text-xl text-gray-600">
              Una plataforma completa que combina tecnología avanzada con educación financiera 
              para transformar la relación de tus empleados con el dinero.
            </p>
          </AnimatedSection>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              { icon: Wallet, title: "Adelanto de Salario (EWA)", desc: "Permite a tus empleados acceder a su salario ganado antes del día de pago, sin intereses ni complicaciones.", color: "green" },
              { icon: BarChart3, title: "FWI Score Inteligente", desc: "Índice de bienestar financiero personalizado que ayuda a cada empleado a entender y mejorar su salud financiera.", color: "blue" },
              { icon: Gift, title: "TreePoints & Recompensas", desc: "Sistema de puntos que premia buenos hábitos financieros, canjeables por beneficios exclusivos con comercios aliados.", color: "purple" },
              { icon: Sparkles, title: "Treevü Brain", desc: "Tu asesor financiero con IA que brinda consejos personalizados basados en tu perfil y metas financieras.", color: "green" },
              { icon: TrendingUp, title: "Análisis de Riesgo (IPR)", desc: "Dashboard B2B que identifica empleados en riesgo de rotación basado en indicadores de estrés financiero.", color: "red" },
              { icon: Shield, title: "Seguridad Avanzada", desc: "Protección de datos con encriptación, detección de fraude y cumplimiento de normativas financieras.", color: "teal" },
            ].map((feature, i) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                  <CardHeader>
                    <motion.div 
                      className={`bg-${feature.color}-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                    </motion.div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 px-4 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection className="space-y-8">
              <h2 className="text-4xl font-bold">
                Beneficios para tu empresa
              </h2>
              <p className="text-xl text-green-100">
                Invertir en el bienestar financiero de tus empleados no solo es lo correcto, 
                también es rentable. Descubre cómo Treevü impacta positivamente tu negocio.
              </p>
              
              <motion.div 
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { icon: Users, title: "Reduce la rotación 35%", desc: "Empleados con mejor salud financiera son más leales y comprometidos." },
                  { icon: Clock, title: "Aumenta productividad 20%", desc: "Menos estrés financiero significa más concentración en el trabajo." },
                  { icon: Heart, title: "Mejora el clima laboral", desc: "Un beneficio diferenciador que demuestra que te importa tu equipo." },
                  { icon: DollarSign, title: "ROI comprobado", desc: "Por cada $1 invertido, las empresas recuperan $3 en productividad." },
                ].map((benefit) => (
                  <motion.div 
                    key={benefit.title}
                    className="flex items-start space-x-4"
                    variants={fadeInUp}
                    whileHover={{ x: 10 }}
                  >
                    <div className="bg-white/20 p-3 rounded-xl">
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-green-100">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6">Impacto medible</h3>
                <div className="space-y-6">
                  {[
                    { label: "Reducción de ausentismo", value: 28 },
                    { label: "Mejora en FWI Score promedio", value: 45 },
                    { label: "Satisfacción de empleados", value: 92 },
                    { label: "Adopción de la plataforma", value: 85 },
                  ].map((metric, i) => (
                    <motion.div 
                      key={metric.label}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <div className="flex justify-between mb-2">
                        <span>{metric.label}</span>
                        <span className="font-bold">{metric.value}%</span>
                      </div>
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-3 bg-white rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600">
              Empresas de todos los tamaños confían en Treevü para mejorar 
              el bienestar financiero de sus equipos.
            </p>
          </AnimatedSection>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { name: "María Castillo", role: "Directora de RRHH, TechCorp", initials: "MC", color: "green", quote: "Desde que implementamos Treevü, hemos visto una reducción significativa en la rotación de personal. Nuestros empleados están más tranquilos y enfocados en su trabajo." },
              { name: "Juan Rodríguez", role: "CEO, RetailMax", initials: "JR", color: "blue", quote: "El EWA ha sido un game-changer. Nuestros empleados ya no tienen que recurrir a préstamos con intereses altos cuando tienen emergencias. Es un beneficio que realmente valoran." },
              { name: "Ana López", role: "VP People, FinanceHub", initials: "AL", color: "purple", quote: "El dashboard B2B nos permite identificar problemas antes de que se conviertan en renuncias. La analítica predictiva de Treevü es increíblemente precisa." },
            ].map((testimonial, i) => (
              <motion.div key={testimonial.name} variants={fadeInUp}>
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[1,2,3,4,5].map(j => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * j }}
                        >
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center space-x-3">
                      <div className={`bg-${testimonial.color}-100 w-12 h-12 rounded-full flex items-center justify-center`}>
                        <span className={`text-${testimonial.color}-600 font-bold`}>{testimonial.initials}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 px-4">
        <div className="container mx-auto">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planes flexibles para cada empresa
            </h2>
            <p className="text-xl text-gray-600">
              Sin costos ocultos. Sin compromisos a largo plazo. 
              Escala según tus necesidades.
            </p>
          </AnimatedSection>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Starter Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="border-2 border-gray-200 hover:border-green-300 transition-colors h-full">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl text-gray-900">Starter</CardTitle>
                  <CardDescription>Para empresas pequeñas</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-gray-900">$3</span>
                    <span className="text-gray-500">/empleado/mes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {["Hasta 50 empleados", "EWA básico", "FWI Score", "Dashboard básico", "Soporte por email"].map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full mt-6 border-green-200 text-green-600 hover:bg-green-50">
                      Comenzar Gratis
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Business Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="border-2 border-green-500 shadow-xl relative h-full">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <motion.span 
                    className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Más Popular
                  </motion.span>
                </div>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl text-gray-900">Business</CardTitle>
                  <CardDescription>Para empresas en crecimiento</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-gray-900">$5</span>
                    <span className="text-gray-500">/empleado/mes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {["Hasta 500 empleados", "EWA completo", "TreePoints & Recompensas", "Dashboard B2B avanzado", "Análisis de riesgo (IPR)", "Treevü Brain", "Soporte prioritario"].map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600">
                      Solicitar Demo
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Enterprise Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="border-2 border-gray-200 hover:border-green-300 transition-colors h-full">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl text-gray-900">Enterprise</CardTitle>
                  <CardDescription>Para grandes corporaciones</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-gray-900">Custom</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {["Empleados ilimitados", "Todo en Business", "API personalizada", "Integraciones HRIS", "SLA garantizado", "Account manager dedicado"].map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full mt-6 border-green-200 text-green-600 hover:bg-green-50">
                      Contactar Ventas
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-white mb-6">
              ¿Listo para transformar el bienestar financiero de tu equipo?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Agenda una demo personalizada y descubre cómo Treevü puede ayudar 
              a tu empresa a reducir la rotación y aumentar la productividad.
            </p>
          </AnimatedSection>
          
          <AnimatedSection>
            <motion.div 
              className="bg-white rounded-2xl p-8 max-w-xl mx-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nombre" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Apellido" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email corporativo" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Empresa" 
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <select 
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-500 transition-all"
                  required
                >
                  <option value="">Número de empleados</option>
                  <option value="1-50">1-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-lg py-6"
                    disabled={submitDemo.isPending}
                  >
                    {submitDemo.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Solicitar Demo Gratis
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
              <p className="text-sm text-gray-500 mt-4">
                Sin compromiso. Respuesta en menos de 24 horas.
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Treevü</span>
              </div>
              <p className="text-sm">
                Transformando el bienestar financiero de los empleados en Latinoamérica.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#características" className="hover:text-green-400 transition-colors">Características</a></li>
                <li><a href="#precios" className="hover:text-green-400 transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Integraciones</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Sobre nosotros</a></li>
                <li><Link href="/blog" className="hover:text-green-400 transition-colors">Blog</Link></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Carreras</a></li>
                <li><a href="#contact" className="hover:text-green-400 transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Seguridad</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 Treevü. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-green-400 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-green-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-green-400 transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
