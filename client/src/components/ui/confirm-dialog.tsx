import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmVariant = 'default' | 'danger' | 'success' | 'warning';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const variantConfig: Record<ConfirmVariant, {
  icon: React.ElementType;
  iconColor: string;
  buttonClass: string;
}> = {
  default: {
    icon: Info,
    iconColor: 'text-brand-primary',
    buttonClass: 'bg-brand-primary hover:bg-brand-primary/90',
  },
  danger: {
    icon: XCircle,
    iconColor: 'text-red-500',
    buttonClass: 'bg-red-600 hover:bg-red-700',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-green-500',
    buttonClass: 'bg-green-600 hover:bg-green-700',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
  },
};

/**
 * ConfirmDialog - Modal de confirmación con animaciones y variantes
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm();
    if (!loading) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return;
      
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loading]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-treevu-surface border-white/10 text-white max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className={`p-2 rounded-full bg-white/5 ${config.iconColor}`}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
            <AlertDialogTitle className="text-lg font-semibold">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-400 text-sm pl-11">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel 
            onClick={handleCancel}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            disabled={loading}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={config.buttonClass}
            disabled={loading}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Hook para usar el ConfirmDialog de forma imperativa
 */
export function useConfirmDialog() {
  const [state, setState] = React.useState<{
    open: boolean;
    props: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'> | null;
  }>({
    open: false,
    props: null,
  });

  const confirm = React.useCallback((props: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>) => {
    return new Promise<boolean>((resolve) => {
      setState({
        open: true,
        props: {
          ...props,
          onConfirm: async () => {
            await props.onConfirm?.();
            resolve(true);
          },
          onCancel: () => {
            props.onCancel?.();
            resolve(false);
          },
        },
      });
    });
  }, []);

  const dialog = state.props ? (
    <ConfirmDialog
      open={state.open}
      onOpenChange={(open) => setState(prev => ({ ...prev, open }))}
      {...state.props}
    />
  ) : null;

  return { confirm, dialog };
}

export default ConfirmDialog;
