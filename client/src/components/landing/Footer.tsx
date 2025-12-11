import React from 'react';
import { Leaf, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-500 py-12 border-t border-treevu-active">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary blur opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <div className="relative bg-treevu-surface p-1.5 rounded-lg border border-treevu-active">
                <Leaf className="h-5 w-5 text-brand-primary" />
              </div>
            </div>
            <span className="font-display font-bold text-xl text-white">Treevü</span>
          </div>

          {/* Socials */}
          <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-treevu-surface flex items-center justify-center text-gray-400 hover:bg-brand-primary hover:text-treevu-base transition-all duration-300"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-treevu-surface flex items-center justify-center text-gray-400 hover:bg-segment-empresa hover:text-white transition-all duration-300"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-treevu-surface flex items-center justify-center text-gray-400 hover:bg-segment-socio hover:text-white transition-all duration-300"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-treevu-active flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} Treevü Inc. Hecho con 💚 en Lima y San Francisco.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <a href="mailto:contacto@treevu.app" className="flex items-center gap-2 hover:text-white transition-colors">
               <Mail className="w-3 h-3" /> contacto@treevu.app
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;