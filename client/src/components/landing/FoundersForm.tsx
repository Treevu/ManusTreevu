import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Check, User, Building2, Lock } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const FoundersForm: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [segment, setSegment] = useState<'PERSONA' | 'EMPRESA'>('EMPRESA');
  
  // Form state
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [employeeCount, setEmployeeCount] = useState('100 - 500 Colaboradores');

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      toast.success('¡Aplicación enviada exitosamente!');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al enviar la aplicación');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    submitLead.mutate({
      contactName,
      email,
      companyName: segment === 'EMPRESA' ? companyName : `Usuario: ${contactName}`,
      employeeCount: segment === 'EMPRESA' ? employeeCount : 'N/A (Usuario)',
      source: segment === 'EMPRESA' ? 'founders_form_empresa' : 'founders_form_persona',
    });
  };

  const resetForm = () => {
    setIsSuccess(false);
    setContactName('');
    setEmail('');
    setCompanyName('');
    setEmployeeCount('100 - 500 Colaboradores');
  };

  return (
    <section id="founders-offer" className="py-32 relative overflow-hidden bg-[#0f0f11]">
      {/* Gold gradient background accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent via-yellow-200 to-brand-accent opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent opacity-5 rounded-full blur-[100px]"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-treevu-surface rounded-[2.5rem] shadow-2xl border border-treevu-active overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Content */}
            <div className="p-10 md:p-14 md:w-1/2 relative overflow-hidden flex flex-col justify-center">
               {/* Decorative elements */}
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-accent/10 to-transparent"></div>
               
               <div className="relative z-10">
                 <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent font-bold uppercase tracking-widest text-xs">
                   <Lock className="w-3 h-3" />
                   Acceso Limitado Q3 2025
                 </div>
                 
                 <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight text-white">
                   Aplica al Programa <br/>
                   <span className="text-brand-accent">Founder Partners</span>
                 </h2>
                 
                 <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                   {segment === 'EMPRESA' 
                     ? 'Buscamos 10 empresas visionarias para implementar el piloto de "Inteligencia de Nómina". No vendemos software, construimos el futuro con partners estratégicos.' 
                     : 'El acceso a Treevü Plus está restringido actualmente. Únete a la lista de espera para ser notificado cuando abramos nuevos cupos.'}
                 </p>
                 
                 <div className="bg-black/30 rounded-xl p-5 border border-brand-accent/20 mb-6">
                    <p className="text-xs text-brand-accent font-bold uppercase mb-3">Beneficios exclusivos del programa:</p>
                    <ul className="space-y-3">
                    {[
                        'Implementación White-Glove (Sin costo)',
                        'Acceso anticipado a Risk Engine IA',
                        'Tarifas preferenciales de por vida (Locked-in)',
                        'Sesiones trimestrales con Product Founders'
                    ].map((item, i) => (
                        <li key={i} className="flex items-center text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-brand-accent mr-3 shrink-0" />
                        {item}
                        </li>
                    ))}
                    </ul>
                 </div>
               </div>
            </div>

            {/* Right Form */}
            <div className="p-10 md:p-14 md:w-1/2 bg-treevu-base relative">
              
              {/* Segment Toggle */}
              {!isSuccess && (
                <div className="flex bg-treevu-surface border border-treevu-active rounded-xl p-1 mb-8">
                  <button 
                    onClick={() => setSegment('EMPRESA')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      segment === 'EMPRESA' 
                        ? 'bg-treevu-active text-white shadow-lg' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    Soy Empresa
                  </button>
                  <button 
                    onClick={() => setSegment('PERSONA')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      segment === 'PERSONA' 
                        ? 'bg-treevu-active text-white shadow-lg' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Soy Usuario
                  </button>
                </div>
              )}

              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up min-h-[400px]">
                  <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mb-6 border border-brand-primary/50">
                    <Check className="w-10 h-10 text-brand-primary" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white mb-3">¡Aplicación Recibida!</h3>
                  <p className="text-gray-400 mb-8">
                    {segment === 'EMPRESA' 
                     ? 'Tu perfil está siendo evaluado por nuestro comité de admisión. Te contactaremos en 24h para verificar elegibilidad.' 
                     : 'Estás en la lista. Te notificaremos apenas se libere un cupo en tu región.'}
                  </p>
                  <button 
                    onClick={resetForm}
                    className="text-brand-primary font-bold hover:text-brand-secondary underline transition-colors"
                  >
                    Volver al inicio
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Nombre y Apellido</label>
                    <input 
                      type="text" 
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-treevu-surface border border-treevu-active text-white placeholder-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all"
                      placeholder="Ej. Roberto Martínez"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Correo {segment === 'EMPRESA' ? 'Corporativo' : 'Personal'}</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-treevu-surface border border-treevu-active text-white placeholder-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all"
                      placeholder={segment === 'EMPRESA' ? 'roberto@empresa.com' : 'roberto@gmail.com'}
                    />
                  </div>

                   {segment === 'EMPRESA' && (
                     <div className="animate-fade-in-up space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Empresa</label>
                        <input 
                            type="text" 
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-treevu-surface border border-treevu-active text-white placeholder-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all"
                            placeholder="Nombre de la Organización"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Tamaño de Nómina (Aprox)</label>
                        <select 
                          value={employeeCount}
                          onChange={(e) => setEmployeeCount(e.target.value)}
                          className="w-full px-5 py-4 rounded-xl bg-treevu-surface border border-treevu-active text-white placeholder-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option>100 - 500 Colaboradores</option>
                            <option>500 - 2,000 Colaboradores</option>
                            <option>+2,000 Colaboradores</option>
                        </select>
                      </div>
                    </div>
                   )}

                  <button 
                    type="submit" 
                    disabled={submitLead.isPending}
                    className="w-full bg-brand-accent hover:bg-[#e5bb12] text-treevu-base py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                  >
                    {submitLead.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        {segment === 'EMPRESA' ? 'Aplicar al Programa' : 'Unirme a la Waitlist'}
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-500 mt-2">
                      Al aplicar aceptas nuestra política de privacidad. Cupos limitados.
                  </p>
                </form>
              )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersForm;
