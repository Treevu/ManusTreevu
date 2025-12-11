import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Variantes de animación
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const contentVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 },
  },
};

// Tipos de estado del modal
type ModalState = 'idle' | 'loading' | 'success' | 'error';

interface EnhancedDialogContextValue {
  state: ModalState;
  setState: (state: ModalState) => void;
  message: string;
  setMessage: (message: string) => void;
}

const EnhancedDialogContext = React.createContext<EnhancedDialogContextValue | null>(null);

export function useEnhancedDialog() {
  const context = React.useContext(EnhancedDialogContext);
  if (!context) {
    throw new Error('useEnhancedDialog must be used within EnhancedDialog');
  }
  return context;
}

interface EnhancedDialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
  children: React.ReactNode;
}

export function EnhancedDialog({ children, ...props }: EnhancedDialogProps) {
  const [state, setState] = React.useState<ModalState>('idle');
  const [message, setMessage] = React.useState('');

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!props.open) {
      const timer = setTimeout(() => {
        setState('idle');
        setMessage('');
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [props.open]);

  return (
    <EnhancedDialogContext.Provider value={{ state, setState, message, setMessage }}>
      <DialogPrimitive.Root {...props}>
        {children}
      </DialogPrimitive.Root>
    </EnhancedDialogContext.Provider>
  );
}

export const EnhancedDialogTrigger = DialogPrimitive.Trigger;

interface EnhancedDialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function EnhancedDialogContent({
  className,
  children,
  showCloseButton = true,
  size = 'md',
  ...props
}: EnhancedDialogContentProps) {
  const context = React.useContext(EnhancedDialogContext);
  const state = context?.state || 'idle';

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content asChild {...props}>
          <motion.div
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
              "bg-treevu-surface border border-white/10 rounded-xl shadow-2xl",
              "p-6 focus:outline-none",
              sizeClasses[size],
              className
            )}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Estado de feedback */}
            <AnimatePresence mode="wait">
              {state === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-treevu-surface/95 rounded-xl flex flex-col items-center justify-center z-10"
                >
                  <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-3" />
                  <p className="text-white/80 text-sm">{context?.message || 'Procesando...'}</p>
                </motion.div>
              )}
              {state === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-treevu-surface/95 rounded-xl flex flex-col items-center justify-center z-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-brand-primary mb-3" />
                  </motion.div>
                  <p className="text-white font-semibold text-lg">{context?.message || '¡Completado!'}</p>
                </motion.div>
              )}
              {state === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-treevu-surface/95 rounded-xl flex flex-col items-center justify-center z-10"
                >
                  <AlertCircle className="w-16 h-16 text-red-500 mb-3" />
                  <p className="text-white font-semibold text-lg">{context?.message || 'Error'}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contenido del modal */}
            <div className={cn(state !== 'idle' && 'opacity-0 pointer-events-none')}>
              {children}
            </div>

            {/* Botón de cerrar */}
            {showCloseButton && state === 'idle' && (
              <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary">
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </DialogPrimitive.Close>
            )}
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </AnimatePresence>
  );
}

export function EnhancedDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 text-center sm:text-left mb-4", className)}
      {...props}
    />
  );
}

export function EnhancedDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6",
        className
      )}
      {...props}
    />
  );
}

export function EnhancedDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-xl font-semibold text-white", className)}
      {...props}
    />
  );
}

export function EnhancedDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-gray-400", className)}
      {...props}
    />
  );
}

export {
  EnhancedDialog as Dialog,
  EnhancedDialogTrigger as DialogTrigger,
  EnhancedDialogContent as DialogContent,
  EnhancedDialogHeader as DialogHeader,
  EnhancedDialogFooter as DialogFooter,
  EnhancedDialogTitle as DialogTitle,
  EnhancedDialogDescription as DialogDescription,
};
