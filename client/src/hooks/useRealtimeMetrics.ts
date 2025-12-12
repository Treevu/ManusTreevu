import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

// Tipos de eventos en tiempo real
export type RealtimeEvent = 
  | { type: "fwi_update"; userId: string; score: number; change: number }
  | { type: "treepoints_update"; userId: string; balance: number; change: number; reason: string }
  | { type: "alert_triggered"; alertId: string; title: string; severity: "low" | "medium" | "high" | "critical" }
  | { type: "ewa_status"; requestId: string; status: "approved" | "rejected"; userId: string }
  | { type: "goal_progress"; userId: string; goalId: string; progress: number; completed: boolean }
  | { type: "new_transaction"; userId: string; amount: number; category: string }
  | { type: "leaderboard_change"; userId: string; newRank: number; previousRank: number }
  | { type: "badge_earned"; userId: string; badgeId: string; badgeName: string };

interface UseRealtimeMetricsOptions {
  onFwiUpdate?: (score: number, change: number) => void;
  onTreepointsUpdate?: (balance: number, change: number, reason: string) => void;
  onAlertTriggered?: (alertId: string, title: string, severity: string) => void;
  onEwaStatus?: (requestId: string, status: string) => void;
  onGoalProgress?: (goalId: string, progress: number, completed: boolean) => void;
  onNewTransaction?: (amount: number, category: string) => void;
  onLeaderboardChange?: (newRank: number, previousRank: number) => void;
  onBadgeEarned?: (badgeId: string, badgeName: string) => void;
  showToasts?: boolean;
  departmentId?: string;
}

interface RealtimeState {
  connected: boolean;
  lastFwiScore: number | null;
  lastTreepoints: number | null;
  recentEvents: RealtimeEvent[];
}

export function useRealtimeMetrics(options: UseRealtimeMetricsOptions = {}) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<RealtimeState>({
    connected: false,
    lastFwiScore: null,
    lastTreepoints: null,
    recentEvents: []
  });

  const {
    onFwiUpdate,
    onTreepointsUpdate,
    onAlertTriggered,
    onEwaStatus,
    onGoalProgress,
    onNewTransaction,
    onLeaderboardChange,
    onBadgeEarned,
    showToasts = true,
    departmentId
  } = options;

  const handleEvent = useCallback((event: RealtimeEvent) => {
    // Agregar a eventos recientes (máximo 50)
    setState(prev => ({
      ...prev,
      recentEvents: [event, ...prev.recentEvents].slice(0, 50)
    }));

    switch (event.type) {
      case "fwi_update":
        setState(prev => ({ ...prev, lastFwiScore: event.score }));
        onFwiUpdate?.(event.score, event.change);
        if (showToasts && event.change !== 0) {
          const emoji = event.change > 0 ? "📈" : "📉";
          toast.info(`${emoji} Tu FWI Score ${event.change > 0 ? "subió" : "bajó"} a ${event.score}`, {
            description: `Cambio: ${event.change > 0 ? "+" : ""}${event.change} puntos`
          });
        }
        break;

      case "treepoints_update":
        setState(prev => ({ ...prev, lastTreepoints: event.balance }));
        onTreepointsUpdate?.(event.balance, event.change, event.reason);
        if (showToasts && event.change > 0) {
          toast.success(`🌳 +${event.change} TreePoints`, {
            description: event.reason
          });
        }
        break;

      case "alert_triggered":
        onAlertTriggered?.(event.alertId, event.title, event.severity);
        if (showToasts) {
          const severityEmoji = {
            low: "ℹ️",
            medium: "⚠️",
            high: "🔶",
            critical: "🚨"
          };
          toast.warning(`${severityEmoji[event.severity]} ${event.title}`, {
            description: `Severidad: ${event.severity}`
          });
        }
        break;

      case "ewa_status":
        onEwaStatus?.(event.requestId, event.status);
        if (showToasts) {
          if (event.status === "approved") {
            toast.success("✅ Tu solicitud de EWA fue aprobada", {
              description: "El dinero será depositado en tu cuenta"
            });
          } else {
            toast.error("❌ Tu solicitud de EWA fue rechazada", {
              description: "Contacta a RRHH para más información"
            });
          }
        }
        break;

      case "goal_progress":
        onGoalProgress?.(event.goalId, event.progress, event.completed);
        if (showToasts && event.completed) {
          toast.success("🎯 ¡Meta completada!", {
            description: "Has alcanzado tu objetivo financiero"
          });
        }
        break;

      case "new_transaction":
        onNewTransaction?.(event.amount, event.category);
        break;

      case "leaderboard_change":
        onLeaderboardChange?.(event.newRank, event.previousRank);
        if (showToasts && event.newRank < event.previousRank) {
          toast.success(`🏆 ¡Subiste al puesto #${event.newRank}!`, {
            description: `Antes estabas en el puesto #${event.previousRank}`
          });
        }
        break;

      case "badge_earned":
        onBadgeEarned?.(event.badgeId, event.badgeName);
        if (showToasts) {
          toast.success(`🏅 ¡Nueva insignia: ${event.badgeName}!`, {
            description: "Revisa tu colección de badges"
          });
        }
        break;
    }
  }, [
    onFwiUpdate, onTreepointsUpdate, onAlertTriggered, onEwaStatus,
    onGoalProgress, onNewTransaction, onLeaderboardChange, onBadgeEarned,
    showToasts
  ]);

  useEffect(() => {
    if (!user?.id) return;

    // Conectar al servidor WebSocket
    const socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"]
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[WebSocket] Connected");
      setState(prev => ({ ...prev, connected: true }));
      
      // Autenticar con el userId
      socket.emit("authenticate", user.id);
    });

    socket.on("authenticated", (data: { success: boolean; userId: string }) => {
      console.log("[WebSocket] Authenticated:", data);
      
      // Suscribirse a departamento si se especifica
      if (departmentId) {
        socket.emit("subscribe_department", departmentId);
      }
    });

    socket.on("realtime_event", (event: RealtimeEvent) => {
      console.log("[WebSocket] Event received:", event);
      handleEvent(event);
    });

    socket.on("disconnect", () => {
      console.log("[WebSocket] Disconnected");
      setState(prev => ({ ...prev, connected: false }));
    });

    socket.on("connect_error", (error) => {
      console.error("[WebSocket] Connection error:", error);
      setState(prev => ({ ...prev, connected: false }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id, departmentId, handleEvent]);

  // Función para suscribirse a un departamento
  const subscribeToDepartment = useCallback((deptId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("subscribe_department", deptId);
    }
  }, []);

  return {
    ...state,
    subscribeToDepartment
  };
}

// Hook simplificado para solo mostrar indicador de conexión
export function useRealtimeConnection() {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("authenticate", user.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  return connected;
}
