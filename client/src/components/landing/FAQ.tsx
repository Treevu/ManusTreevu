
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Zap, FileText } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-brand-primary' : 'text-white group-hover:text-gray-300'}`}>
          {question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-brand-primary' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-400 leading-relaxed text-sm pr-4">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Cómo se integra Treevü con mi sistema de nómina (HRIS)?",
      answer: "Treevü es agnóstico a la tecnología. Nos integramos vía API REST segura con los principales ERPs (SAP, Oracle, Buk, etc.) o mediante intercambio de archivos planos encriptados (SFTP) para una implementación sin fricción técnica. No requerimos acceso de escritura a tu base de datos principal."
    },
    {
      question: "¿El adelanto de salario genera intereses o deuda para el empleado?",
      answer: "No. Bajo el modelo EWA Lite, no es un préstamo. Es una 'Cesión de Derechos de Cobro' sobre el salario ya devengado. Legalmente no constituye deuda, por lo que no genera intereses ni afecta el historial crediticio en centrales de riesgo."
    },
    {
      question: "¿Treevü afecta el flujo de caja de la empresa?",
      answer: "No necesariamente. Nuestro modelo 'Dispersión Directa' permite a la empresa mantener el control total de la tesorería, realizando los pagos como parte de su ciclo normal, solo adelantando la fecha de dispersión de una porción. También ofrecemos opciones con aliados financieros si prefieres no usar capital propio."
    },
    {
      question: "¿Cuánto tiempo toma la implementación?",
      answer: "Gracias a nuestra arquitectura SaaS modular, el 'Onboarding Express' toma entre 2 a 4 semanas, dependiendo de la complejidad de la nómina. Proveemos kits de comunicación y soporte técnico dedicado durante todo el proceso."
    },
    {
      question: "¿Cómo garantizan la seguridad de los datos sensibles?",
      answer: "Operamos bajo estándares ISO 27001. Toda la información está encriptada en tránsito (TLS 1.3) y en reposo (AES-256). Treevü nunca almacena credenciales bancarias y utiliza arquitectura de 'Secure Enclave' para el procesamiento de datos personales."
    }
  ];

  return (
    <section className="py-24 bg-[#161618] border-t border-treevu-active relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Header Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-bold uppercase tracking-widest text-xs mb-6">
                <HelpCircle className="w-3 h-3" /> Dudas Comunes
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Resolvemos tus dudas <br/>
                <span className="text-treevu-muted">antes de empezar.</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Entendemos que tocar la nómina es delicado. Hemos diseñado Treevü para ser seguro, legal y fácil de implementar para equipos de RR.HH. y Finanzas.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Compliance Legal & Fiscal</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Implementación en semanas</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>Documentación API Abierta</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion Column */}
          <div className="lg:col-span-8 bg-treevu-surface rounded-3xl border border-treevu-active p-8 md:p-10 shadow-xl">
             <div className="divide-y divide-white/10">
                {faqs.map((faq, idx) => (
                  <FAQItem 
                    key={idx}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === idx}
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  />
                ))}
             </div>
             
             <div className="mt-8 pt-8 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm mb-4">¿Tienes una pregunta técnica específica?</p>
                <a href="mailto:soporte@treevu.app" className="text-brand-primary font-bold hover:underline">Contactar al equipo de Ingeniería</a>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;
