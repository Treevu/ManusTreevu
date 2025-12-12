import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Shield, 
  ShieldCheck, 
  ShieldOff, 
  Smartphone, 
  Key, 
  Copy, 
  Check, 
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  Loader2
} from 'lucide-react';

export default function SecuritySettings() {
  const { user } = useAuth();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [regenerateCode, setRegenerateCode] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [setupData, setSetupData] = useState<{ qrCode: string; backupCodes: string[] } | null>(null);
  const [newBackupCodes, setNewBackupCodes] = useState<string[] | null>(null);

  const { data: mfaStatus, refetch: refetchStatus } = trpc.mfa.getStatus.useQuery();
  
  const setupMutation = trpc.mfa.setup.useMutation({
    onSuccess: (data) => {
      setSetupData(data);
      setShowSetupModal(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verifyMutation = trpc.mfa.verify.useMutation({
    onSuccess: () => {
      toast.success('¡MFA Activado! Tu cuenta ahora está protegida.');
      setShowSetupModal(false);
      setVerificationCode('');
      refetchStatus();
    },
    onError: (error) => {
      toast.error('Código inválido. Por favor verifica e intenta nuevamente.');
    },
  });

  const disableMutation = trpc.mfa.disable.useMutation({
    onSuccess: () => {
      toast.success('MFA Desactivado. La autenticación de dos factores ha sido desactivada.');
      setShowDisableModal(false);
      setDisableCode('');
      refetchStatus();
    },
    onError: (error) => {
      toast.error('Código inválido. Por favor verifica e intenta nuevamente.');
    },
  });

  const regenerateMutation = trpc.mfa.regenerateBackupCodes.useMutation({
    onSuccess: (data) => {
      setNewBackupCodes(data.backupCodes);
      setShowBackupCodesModal(true);
      setRegenerateCode('');
      refetchStatus();
      toast.success('Códigos regenerados. Tus nuevos códigos de respaldo están listos.');
    },
    onError: (error) => {
      toast.error('Código inválido. Por favor verifica e intenta nuevamente.');
    },
  });

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllCodes = (codes: string[]) => {
    navigator.clipboard.writeText(codes.join('\n'));
    toast.success('Todos los códigos han sido copiados al portapapeles.');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Seguridad</h1>
              <p className="text-sm text-gray-400">Configura la autenticación de dos factores</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* MFA Status Card */}
        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {mfaStatus?.enabled ? (
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <ShieldOff className="w-6 h-6 text-amber-400" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-white">Autenticación de Dos Factores (2FA)</CardTitle>
                  <CardDescription className="text-gray-400">
                    Protege tu cuenta con un código adicional
                  </CardDescription>
                </div>
              </div>
              <Badge 
                variant={mfaStatus?.enabled ? 'default' : 'outline'}
                className={mfaStatus?.enabled 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                  : 'border-amber-500/50 text-amber-400'
                }
              >
                {mfaStatus?.enabled ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              La autenticación de dos factores agrega una capa extra de seguridad a tu cuenta. 
              Además de tu contraseña, necesitarás un código generado por una app como Google Authenticator.
            </p>

            {mfaStatus?.enabled ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Códigos de respaldo</p>
                      <p className="text-xs text-gray-400">
                        {mfaStatus.backupCodesRemaining} códigos disponibles
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => {
                      const code = prompt('Ingresa tu código de autenticador para regenerar códigos de respaldo:');
                      if (code && code.length === 6) {
                        regenerateMutation.mutate({ token: code });
                      }
                    }}
                    disabled={regenerateMutation.isPending}
                  >
                    {regenerateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Regenerar
                  </Button>
                </div>

                {mfaStatus.verifiedAt && (
                  <p className="text-xs text-gray-500">
                    Activado el {new Date(mfaStatus.verifiedAt).toLocaleDateString('es-PE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}

                <Button 
                  variant="outline" 
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => setShowDisableModal(true)}
                >
                  <ShieldOff className="w-4 h-4 mr-2" />
                  Desactivar 2FA
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                onClick={() => setupMutation.mutate()}
                disabled={setupMutation.isPending}
              >
                {setupMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                Activar Autenticación de Dos Factores
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Consejos de Seguridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
              <Smartphone className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Usa una app de autenticación</p>
                <p className="text-xs text-gray-400">
                  Recomendamos Google Authenticator, Authy o Microsoft Authenticator
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
              <Key className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Guarda tus códigos de respaldo</p>
                <p className="text-xs text-gray-400">
                  Almacénalos en un lugar seguro en caso de perder acceso a tu teléfono
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Setup Modal */}
      <Dialog open={showSetupModal} onOpenChange={setShowSetupModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Configurar 2FA
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Escanea el código QR con tu app de autenticación
            </DialogDescription>
          </DialogHeader>

          {setupData && (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl">
                  <img src={setupData.qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              </div>

              {/* Verification Input */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Ingresa el código de 6 dígitos</label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="bg-gray-800 border-gray-700 text-white text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
              </div>

              {/* Backup Codes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">Códigos de respaldo</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-emerald-400 hover:text-emerald-300"
                    onClick={() => copyAllCodes(setupData.backupCodes)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar todos
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {setupData.backupCodes.map((code, index) => (
                    <button
                      key={index}
                      onClick={() => copyToClipboard(code, index)}
                      className="flex items-center justify-between p-2 bg-gray-800 rounded font-mono text-sm hover:bg-gray-700 transition-colors"
                    >
                      <span>{code}</span>
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Guarda estos códigos en un lugar seguro. No podrás verlos de nuevo.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSetupModal(false)}
              className="border-gray-700"
            >
              Cancelar
            </Button>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={() => verifyMutation.mutate({ token: verificationCode })}
              disabled={verificationCode.length !== 6 || verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Verificar y Activar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Modal */}
      <Dialog open={showDisableModal} onOpenChange={setShowDisableModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Desactivar 2FA
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Tu cuenta será menos segura sin la autenticación de dos factores
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Ingresa el código de tu app de autenticación para confirmar la desactivación.
            </p>
            <Input
              type="text"
              placeholder="000000"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="bg-gray-800 border-gray-700 text-white text-center text-2xl tracking-widest font-mono"
              maxLength={6}
            />
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDisableModal(false)}
              className="border-gray-700"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={() => disableMutation.mutate({ token: disableCode })}
              disabled={disableCode.length !== 6 || disableMutation.isPending}
            >
              {disableMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Desactivar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Backup Codes Modal */}
      <Dialog open={showBackupCodesModal} onOpenChange={setShowBackupCodesModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              Nuevos Códigos de Respaldo
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Tus códigos anteriores ya no funcionarán
            </DialogDescription>
          </DialogHeader>

          {newBackupCodes && (
            <div className="space-y-4">
              <div className="flex items-center justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-emerald-400 hover:text-emerald-300"
                  onClick={() => copyAllCodes(newBackupCodes)}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copiar todos
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {newBackupCodes.map((code, index) => (
                  <button
                    key={index}
                    onClick={() => copyToClipboard(code, index)}
                    className="flex items-center justify-between p-2 bg-gray-800 rounded font-mono text-sm hover:bg-gray-700 transition-colors"
                  >
                    <span>{code}</span>
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Guarda estos códigos en un lugar seguro.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button 
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              onClick={() => setShowBackupCodesModal(false)}
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
