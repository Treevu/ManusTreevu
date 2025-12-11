import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLocation } from 'wouter';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition = {
  duration: 0.3,
  ease: 'easeOut' as const,
};

/**
 * PageTransition - Wrapper para animaciones de entrada/salida de páginas
 * Uso: Envolver el contenido de cada página con este componente
 */
export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * AnimatedPage - HOC para envolver páginas con transiciones
 * Uso: export default AnimatedPage(MyPageComponent)
 */
export function AnimatedPage<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithPageTransition(props: P) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <WrappedComponent {...props} />
      </motion.div>
    );
  };
}

/**
 * FadeIn - Componente simple para fade in de elementos
 */
export function FadeIn({ 
  children, 
  delay = 0,
  duration = 0.4,
  className = ''
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer - Contenedor para animaciones escalonadas
 */
export function StaggerContainer({ 
  children,
  staggerDelay = 0.1,
  className = ''
}: { 
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem - Item dentro de StaggerContainer
 */
export function StaggerItem({ 
  children,
  className = ''
}: { 
  children: ReactNode;
  className?: string;
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
