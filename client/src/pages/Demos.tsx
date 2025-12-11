import { Link } from 'wouter';
import { ArrowLeft, Users, Building2, Store, Leaf, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Demos() {
  const demos = [
    {
      title: 'Demo Empleado',
      description: 'Experimenta la plataforma desde la perspectiva de un empleado. Explora tu FWI, TreePoints, metas financieras y el asistente Treevü Brain.',
      icon: Users,
      href: '/demo/empleado',
      color: 'brand-primary',
      gradient: 'from-brand-primary/20 to-brand-primary/5',
      features: ['FWI Score personal', 'TreePoints y recompensas', 'Metas financieras', 'Chat con Treevü Brain'],
    },
    {
      title: 'Demo Empresa',
      description: 'Descubre cómo las empresas monitorean el bienestar financiero de sus equipos, analizan riesgos y optimizan su inversión en beneficios.',
      icon: Building2,
      href: '/demo/empresa',
      color: 'segment-empresa',
      gradient: 'from-segment-empresa/20 to-segment-empresa/5',
      features: ['Dashboard ejecutivo', 'Análisis de riesgo', 'Métricas por departamento', 'Reportes exportables'],
    },
    {
      title: 'Demo Comercio',
      description: 'Conoce cómo los comercios pueden crear ofertas personalizadas, segmentar audiencias y medir el impacto de sus campañas.',
      icon: Store,
      href: '/demo/comercio',
      color: 'segment-comercio',
      gradient: 'from-segment-comercio/20 to-segment-comercio/5',
      features: ['Gestión de ofertas', 'Segmentación de audiencia', 'Análisis de competencia', 'Métricas de conversión'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-segment-empresa/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-segment-comercio/5 rounded-full blur-[100px] opacity-50" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Header */}
      <header className="bg-treevu-surface/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-primary blur opacity-40 rounded-full"></div>
                  <div className="relative bg-treevu-surface p-1.5 rounded-lg border border-white/10">
                    <Leaf className="h-5 w-5 text-brand-primary" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-white">Demos Interactivas</h1>
                  <p className="text-sm text-gray-400">Explora Treevü desde cada perspectiva</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Experimenta Treevü en Acción
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explora nuestras demos interactivas para ver cómo Treevü transforma el bienestar financiero 
            desde la perspectiva de empleados, empresas y comercios.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <Card 
                key={demo.title}
                className={`border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10 hover:border-${demo.color}/30 transition-all duration-300 group overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${demo.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardHeader className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-${demo.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${demo.color}`} />
                  </div>
                  <CardTitle className="text-xl text-white">{demo.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {demo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <ul className="space-y-2">
                    {demo.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${demo.color}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={demo.href}>
                    <Button className={`w-full bg-${demo.color} hover:bg-${demo.color}/90 text-white group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]`}>
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar Demo
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-treevu-surface/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              ¿Listo para transformar tu empresa?
            </h3>
            <p className="text-gray-400 mb-6">
              Agenda una demo personalizada con nuestro equipo y descubre cómo Treevü puede 
              mejorar el bienestar financiero de tus colaboradores.
            </p>
            <Link href="/#roi-calculator">
              <Button className="bg-brand-primary hover:bg-brand-primary/90 text-treevu-base px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]">
                Calcular ROI y Agendar Demo
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
