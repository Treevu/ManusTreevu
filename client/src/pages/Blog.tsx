import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  Leaf, ArrowLeft, Clock, User, Tag, Search, 
  TrendingUp, Wallet, Target, Shield, BookOpen,
  ChevronRight, Calendar, ArrowRight
} from "lucide-react";
import { Link } from "wouter";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

// Animated Section Component
function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
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

// Blog articles data
const blogArticles = [
  {
    id: 1,
    slug: "que-es-bienestar-financiero",
    title: "¿Qué es el Bienestar Financiero y Por Qué Importa en tu Empresa?",
    excerpt: "Descubre cómo el bienestar financiero de tus empleados impacta directamente en la productividad, retención y clima laboral de tu organización.",
    content: `
El bienestar financiero es mucho más que tener un buen salario. Se trata de la capacidad de una persona para manejar sus finanzas de manera efectiva, sentirse segura sobre su futuro económico y tener la libertad de tomar decisiones que le permitan disfrutar de la vida.

## ¿Por qué es importante en el trabajo?

Según estudios recientes, el 72% de los empleados reportan que el estrés financiero afecta su productividad en el trabajo. Cuando los colaboradores están preocupados por sus finanzas, es difícil que se concentren en sus tareas.

### Impacto en las empresas:

1. **Productividad**: Empleados con estrés financiero pierden en promedio 3 horas semanales pensando en sus problemas de dinero.

2. **Rotación**: El 40% de los empleados que renuncian citan problemas financieros como factor importante.

3. **Ausentismo**: El estrés financiero está relacionado con mayor ausentismo y problemas de salud.

4. **Engagement**: Empleados financieramente estables muestran 2x más compromiso con su trabajo.

## ¿Cómo medir el bienestar financiero?

El FWI Score (Financial Wellness Index) es una métrica que evalúa:
- Capacidad de ahorro
- Manejo de deudas
- Planificación para emergencias
- Preparación para el retiro
- Satisfacción financiera general

## Soluciones para empresas

Las empresas líderes están implementando programas de bienestar financiero que incluyen:
- Adelantos de salario (EWA)
- Educación financiera
- Herramientas de presupuesto
- Asesoría personalizada

Invertir en el bienestar financiero de tus empleados no es un gasto, es una inversión con retorno comprobado.
    `,
    category: "Bienestar Financiero",
    author: "Equipo Treevü",
    date: "2025-12-01",
    readTime: "8 min",
    image: "gradient-1",
    featured: true,
  },
  {
    id: 2,
    slug: "ewa-adelanto-salario-guia",
    title: "EWA: Guía Completa del Adelanto de Salario para Empresas",
    excerpt: "Todo lo que necesitas saber sobre el Early Wage Access (EWA) y cómo implementarlo en tu organización sin afectar tu flujo de caja.",
    content: `
El Early Wage Access (EWA), o adelanto de salario, es una de las tendencias más importantes en beneficios laborales. Permite a los empleados acceder a una porción de su salario ya ganado antes del día de pago tradicional.

## ¿Cómo funciona el EWA?

1. El empleado trabaja y acumula salario
2. Puede solicitar un adelanto de lo ya ganado (típicamente 50-70%)
3. El monto se descuenta automáticamente en la siguiente nómina
4. Sin intereses ni complicaciones

## Beneficios para empleados:

- **Emergencias cubiertas**: Gastos médicos, reparaciones urgentes
- **Evitar deudas costosas**: No más préstamos con intereses altos
- **Tranquilidad mental**: Saber que pueden acceder a su dinero
- **Mejor planificación**: Control sobre su flujo de efectivo

## Beneficios para empresas:

- **Atracción de talento**: Diferenciador competitivo
- **Retención mejorada**: Empleados más satisfechos
- **Productividad**: Menos estrés financiero
- **Sin costo adicional**: El dinero ya es del empleado

## Implementación exitosa:

### Paso 1: Elegir el proveedor correcto
Busca plataformas que ofrezcan:
- Integración con tu sistema de nómina
- Sin costo para el empleado
- Dashboard de administración
- Soporte en español

### Paso 2: Comunicar el beneficio
- Sesiones informativas
- Material educativo
- Testimonios de usuarios

### Paso 3: Establecer políticas claras
- Límites de adelanto
- Frecuencia permitida
- Proceso de solicitud

El EWA no es un préstamo, es el salario que el empleado ya ganó. Esta distinción es crucial para la adopción exitosa del programa.
    `,
    category: "EWA",
    author: "María González",
    date: "2025-11-28",
    readTime: "10 min",
    image: "gradient-2",
    featured: true,
  },
  {
    id: 3,
    slug: "reducir-rotacion-bienestar-financiero",
    title: "Cómo Reducir la Rotación de Personal con Bienestar Financiero",
    excerpt: "Estrategias probadas para disminuir la rotación hasta un 35% implementando programas de bienestar financiero en tu empresa.",
    content: `
La rotación de personal es uno de los mayores costos ocultos para las empresas. Reemplazar a un empleado puede costar entre 50% y 200% de su salario anual. Pero hay una solución que muchas empresas están pasando por alto: el bienestar financiero.

## La conexión entre finanzas y rotación

Estudios muestran que:
- 60% de empleados consideran cambiar de trabajo por mejor salario
- 45% han rechazado ofertas por beneficios financieros actuales
- 35% de las renuncias están relacionadas con estrés financiero

## Estrategias efectivas:

### 1. Implementar EWA (Adelanto de Salario)
Permite a los empleados acceder a su salario ganado cuando lo necesiten. Esto reduce la necesidad de buscar trabajos adicionales o préstamos.

### 2. Educación Financiera
Ofrece talleres y recursos sobre:
- Presupuesto personal
- Manejo de deudas
- Inversiones básicas
- Planificación para el retiro

### 3. Programas de Ahorro
Facilita el ahorro automático con:
- Descuentos de nómina voluntarios
- Matching de ahorros
- Cuentas de emergencia

### 4. Asesoría Personalizada
Proporciona acceso a:
- Asesores financieros
- Herramientas de planificación
- Chatbots de IA para consultas

## Métricas de éxito:

Empresas que implementan programas integrales reportan:
- 35% menos rotación
- 28% menos ausentismo
- 20% más productividad
- 92% satisfacción de empleados

## ROI del bienestar financiero:

Por cada $1 invertido en bienestar financiero, las empresas recuperan entre $3 y $5 en:
- Menor costo de reclutamiento
- Mayor productividad
- Menos ausentismo
- Mejor clima laboral

No esperes a que tus mejores talentos se vayan. Invierte en su bienestar financiero hoy.
    `,
    category: "Retención",
    author: "Carlos Mendoza",
    date: "2025-11-25",
    readTime: "7 min",
    image: "gradient-3",
    featured: false,
  },
  {
    id: 4,
    slug: "fwi-score-medir-bienestar",
    title: "FWI Score: Cómo Medir el Bienestar Financiero de tu Equipo",
    excerpt: "Aprende a utilizar el Financial Wellness Index para identificar áreas de mejora y medir el impacto de tus programas de bienestar.",
    content: `
El FWI Score (Financial Wellness Index) es una métrica integral que evalúa la salud financiera de los empleados en una escala de 0 a 100. Es la herramienta más efectiva para entender y mejorar el bienestar financiero de tu equipo.

## Componentes del FWI Score:

### 1. Liquidez (25%)
- Capacidad de cubrir gastos mensuales
- Fondo de emergencia
- Flujo de efectivo positivo

### 2. Manejo de Deudas (25%)
- Ratio deuda/ingreso
- Pagos al día
- Tipos de deuda (buena vs mala)

### 3. Ahorro (25%)
- Tasa de ahorro mensual
- Ahorro para retiro
- Metas financieras

### 4. Planificación (25%)
- Presupuesto activo
- Seguro de vida/gastos médicos
- Plan financiero a largo plazo

## Interpretación del Score:

- **0-40**: Crítico - Necesita intervención inmediata
- **41-60**: En riesgo - Requiere apoyo y educación
- **61-80**: Estable - Buen camino, puede mejorar
- **81-100**: Óptimo - Excelente salud financiera

## Cómo usar el FWI en tu empresa:

### Para RRHH:
- Identificar departamentos con mayor estrés financiero
- Medir impacto de programas de bienestar
- Predecir riesgo de rotación

### Para Empleados:
- Entender su situación actual
- Establecer metas de mejora
- Recibir recomendaciones personalizadas

## Mejores prácticas:

1. **Medir regularmente**: Trimestral o semestral
2. **Mantener anonimato**: Datos agregados por departamento
3. **Actuar sobre resultados**: Implementar programas específicos
4. **Comunicar progreso**: Celebrar mejoras colectivas

El FWI Score no es solo un número, es una herramienta de transformación que puede cambiar la cultura financiera de tu organización.
    `,
    category: "Métricas",
    author: "Ana Rodríguez",
    date: "2025-11-20",
    readTime: "9 min",
    image: "gradient-4",
    featured: false,
  },
  {
    id: 5,
    slug: "educacion-financiera-trabajo",
    title: "Educación Financiera en el Trabajo: Programas que Funcionan",
    excerpt: "Descubre los programas de educación financiera más efectivos para implementar en tu empresa y cómo medir su impacto real.",
    content: `
La educación financiera es la base de cualquier programa de bienestar financiero exitoso. Sin embargo, no todos los programas son iguales. Aquí te mostramos qué funciona y qué no.

## Lo que NO funciona:

- Seminarios largos y aburridos
- Material genérico sin personalización
- Información sin herramientas prácticas
- Programas de una sola vez

## Lo que SÍ funciona:

### 1. Microlearning
- Contenido en cápsulas de 5-10 minutos
- Videos cortos y dinámicos
- Quizzes interactivos
- Accesible desde el celular

### 2. Personalización
- Contenido basado en el FWI Score
- Recomendaciones según etapa de vida
- Metas individuales
- Seguimiento de progreso

### 3. Gamificación
- Puntos por completar módulos
- Badges y reconocimientos
- Competencias amigables
- Recompensas tangibles

### 4. Aplicación Práctica
- Herramientas de presupuesto
- Simuladores de ahorro
- Calculadoras de deuda
- Planes de acción personalizados

## Temas esenciales:

1. **Presupuesto básico**: Ingresos, gastos, ahorro
2. **Manejo de deudas**: Estrategias de pago, consolidación
3. **Fondo de emergencia**: Cuánto y cómo ahorrar
4. **Inversiones**: Conceptos básicos, opciones
5. **Retiro**: Planificación a largo plazo
6. **Seguros**: Protección financiera

## Métricas de éxito:

- Tasa de participación (objetivo: >70%)
- Completación de módulos (objetivo: >50%)
- Mejora en FWI Score (objetivo: +10 puntos)
- Satisfacción del programa (objetivo: >4/5)

## Implementación paso a paso:

1. **Diagnóstico**: Evaluar necesidades con encuesta
2. **Diseño**: Crear contenido relevante
3. **Lanzamiento**: Comunicación y onboarding
4. **Seguimiento**: Medir y ajustar
5. **Evolución**: Actualizar contenido regularmente

La educación financiera no es un gasto, es una inversión en el activo más valioso de tu empresa: tu gente.
    `,
    category: "Educación",
    author: "Roberto Sánchez",
    date: "2025-11-15",
    readTime: "11 min",
    image: "gradient-5",
    featured: false,
  },
  {
    id: 6,
    slug: "treepoints-gamificacion-financiera",
    title: "TreePoints: Gamificación para Mejorar Hábitos Financieros",
    excerpt: "Cómo los sistemas de puntos y recompensas pueden transformar la relación de tus empleados con el dinero de forma divertida.",
    content: `
La gamificación ha demostrado ser una de las herramientas más efectivas para cambiar comportamientos. En el contexto del bienestar financiero, los sistemas de puntos como TreePoints están revolucionando cómo los empleados interactúan con sus finanzas.

## ¿Qué son los TreePoints?

TreePoints es un sistema de recompensas que premia a los empleados por:
- Completar módulos de educación financiera
- Alcanzar metas de ahorro
- Mantener un presupuesto
- Mejorar su FWI Score
- Usar responsablemente el EWA

## Cómo funcionan:

### Ganar puntos:
- Completar un módulo educativo: 50 puntos
- Alcanzar una meta de ahorro: 100 puntos
- Mejorar FWI Score: 10 puntos por punto
- Referir a un compañero: 200 puntos
- Racha de 30 días usando la app: 150 puntos

### Canjear puntos:
- Descuentos en comercios aliados
- Gift cards
- Días libres adicionales
- Donaciones a causas sociales
- Productos y servicios

## Psicología detrás de la gamificación:

1. **Dopamina**: Pequeñas recompensas frecuentes
2. **Progreso visible**: Barras de avance y niveles
3. **Competencia social**: Leaderboards por departamento
4. **Reconocimiento**: Badges y logros públicos
5. **Autonomía**: Elegir cómo usar los puntos

## Resultados comprobados:

Empresas con sistemas de gamificación reportan:
- 3x más engagement con programas de bienestar
- 45% más completación de educación financiera
- 60% mejora en hábitos de ahorro
- 85% satisfacción con el programa

## Mejores prácticas:

### Diseño del programa:
- Puntos fáciles de ganar al inicio
- Dificultad progresiva
- Variedad de formas de ganar
- Opciones de canje atractivas

### Comunicación:
- Notificaciones de logros
- Resumen semanal de puntos
- Celebración de hitos
- Historias de éxito

### Evolución:
- Nuevos retos mensuales
- Eventos especiales
- Colaboración con nuevos comercios
- Feedback de usuarios

La gamificación no es solo diversión, es una estrategia probada para crear cambios de comportamiento duraderos.
    `,
    category: "Gamificación",
    author: "Laura Martínez",
    date: "2025-11-10",
    readTime: "8 min",
    image: "gradient-6",
    featured: false,
  },
];

const categories = ["Todos", "Bienestar Financiero", "EWA", "Retención", "Métricas", "Educación", "Gamificación"];

// Gradient backgrounds for article cards
const gradients: Record<string, string> = {
  "gradient-1": "from-green-400 to-emerald-600",
  "gradient-2": "from-blue-400 to-indigo-600",
  "gradient-3": "from-purple-400 to-pink-600",
  "gradient-4": "from-orange-400 to-red-600",
  "gradient-5": "from-teal-400 to-cyan-600",
  "gradient-6": "from-yellow-400 to-orange-600",
};

// Article detail view
function ArticleDetail({ article, onBack }: { article: typeof blogArticles[0]; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradients[article.image]} py-20 px-4`}>
        <div className="container mx-auto max-w-4xl">
          <motion.button
            onClick={onBack}
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al Blog
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              {article.title}
            </h1>
            <div className="flex items-center space-x-6 text-white/80">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(article.date).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {article.readTime} de lectura
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900"
        >
          {article.content.split('\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={i} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('- ')) {
              return <li key={i} className="ml-4">{paragraph.replace('- ', '')}</li>;
            }
            if (paragraph.match(/^\d+\. /)) {
              return <li key={i} className="ml-4">{paragraph.replace(/^\d+\. /, '')}</li>;
            }
            if (paragraph.trim()) {
              return <p key={i}>{paragraph}</p>;
            }
            return null;
          })}
        </motion.article>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para implementar bienestar financiero en tu empresa?
          </h3>
          <p className="text-gray-600 mb-6">
            Descubre cómo Treevü puede ayudarte a mejorar la salud financiera de tu equipo.
          </p>
          <Link href="/#contact">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600">
              Solicitar Demo Gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<typeof blogArticles[0] | null>(null);
  
  const filteredArticles = blogArticles.filter(article => {
    const matchesCategory = selectedCategory === "Todos" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const featuredArticles = blogArticles.filter(a => a.featured);
  
  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Treevü
              </span>
            </motion.div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-gray-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
            <Link href="/#contact">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600">
                Solicitar Demo
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto text-center max-w-3xl">
          <AnimatedSection>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-6">
              <BookOpen className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-700">Blog & Recursos</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Aprende sobre{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Bienestar Financiero
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Artículos, guías y recursos para transformar la salud financiera 
              de tu equipo y mejorar los resultados de tu empresa.
            </p>
          </AnimatedSection>
          
          {/* Search */}
          <AnimatedSection>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="container mx-auto">
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      {selectedCategory === "Todos" && searchQuery === "" && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Artículos Destacados</h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedArticle(article)}
                  className="cursor-pointer"
                >
                  <Card className="overflow-hidden border-0 shadow-lg h-full">
                    <div className={`h-48 bg-gradient-to-r ${gradients[article.image]} flex items-center justify-center`}>
                      <TrendingUp className="h-16 w-16 text-white/50" />
                    </div>
                    <CardHeader>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          {article.category}
                        </span>
                        <span className="text-gray-400 text-sm">{article.readTime}</span>
                      </div>
                      <CardTitle className="text-xl hover:text-green-600 transition-colors">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <User className="h-4 w-4" />
                          <span>{article.author}</span>
                        </div>
                        <span className="text-green-600 font-medium flex items-center">
                          Leer más <ChevronRight className="h-4 w-4 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {selectedCategory === "Todos" ? "Todos los Artículos" : selectedCategory}
              <span className="text-gray-400 font-normal ml-2">({filteredArticles.length})</span>
            </h2>
          </AnimatedSection>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron artículos</p>
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedArticle(article)}
                  className="cursor-pointer"
                >
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                    <div className={`h-32 bg-gradient-to-r ${gradients[article.image]} flex items-center justify-center`}>
                      <Wallet className="h-10 w-10 text-white/50" />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                          {article.category}
                        </span>
                      </div>
                      <CardTitle className="text-lg hover:text-green-600 transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{article.readTime}</span>
                        </div>
                        <span className="text-green-600 font-medium">Leer →</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto max-w-2xl text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white mb-4">
              Suscríbete a nuestro newsletter
            </h2>
            <p className="text-green-100 mb-8">
              Recibe los mejores artículos sobre bienestar financiero directamente en tu correo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white outline-none"
              />
              <Button className="bg-white text-green-600 hover:bg-green-50">
                Suscribirse
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Treevü</span>
          </div>
          <p className="text-sm mb-4">
            Transformando el bienestar financiero de los empleados en Latinoamérica.
          </p>
          <p className="text-sm">© 2025 Treevü. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
