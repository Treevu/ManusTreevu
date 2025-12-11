import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const headerOffset = 100; // Altura aproximada del header para que no tape el título
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false); // Cerrar menú móvil si está abierto
    }
  };

  const navLinks = [
    { name: 'Soluciones', href: '#solutions' },
    { name: 'Demos', href: '/demos', isExternal: true },
    { name: 'Precios', href: '#pricing' },
    { name: 'Partners', href: '#founders-offer' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-treevu-base/80 backdrop-blur-lg border-b border-treevu-surface py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary blur opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
              <div className="relative bg-treevu-surface p-1.5 rounded-lg border border-treevu-active">
                <Leaf className="h-6 w-6 text-brand-primary" />
              </div>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              Treevü
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-brand-primary font-medium transition-colors text-sm uppercase tracking-wide cursor-pointer"
                >
                  {link.name}
                </a>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-gray-300 hover:text-brand-primary font-medium transition-colors text-sm uppercase tracking-wide cursor-pointer"
                >
                  {link.name}
                </a>
              )
            ))}
            <a 
              href="#roi-calculator"
              onClick={(e) => scrollToSection(e, '#roi-calculator')}
              className="bg-brand-primary hover:bg-brand-secondary text-treevu-base px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] text-sm cursor-pointer whitespace-nowrap"
            >
              Calcular ROI
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-treevu-surface border-t border-treevu-active absolute w-full shadow-2xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-brand-primary hover:bg-treevu-active cursor-pointer"
                >
                  {link.name}
                </a>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-brand-primary hover:bg-treevu-active cursor-pointer"
                >
                  {link.name}
                </a>
              )
            ))}
            <div className="pt-4">
                <a 
                href="#roi-calculator"
                onClick={(e) => scrollToSection(e, '#roi-calculator')}
                className="block w-full text-center bg-brand-primary text-treevu-base px-4 py-3 rounded-lg font-bold hover:bg-brand-secondary transition-colors cursor-pointer"
                >
                Calcular ROI
                </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;