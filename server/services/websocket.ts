import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server | null = null;

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

// Mapa de usuarios conectados por userId
const connectedUsers = new Map<string, Set<string>>();

export function initializeWebSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    path: "/socket.io"
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Autenticar usuario
    socket.on("authenticate", (userId: string) => {
      if (userId) {
        socket.data.userId = userId;
        
        // Agregar socket al mapa de usuarios
        if (!connectedUsers.has(userId)) {
          connectedUsers.set(userId, new Set());
        }
        connectedUsers.get(userId)!.add(socket.id);
        
        // Unirse a sala personal
        socket.join(`user:${userId}`);
        
        // Unirse a sala global para métricas de empresa
        socket.join("global");
        
        console.log(`[WebSocket] User ${userId} authenticated on socket ${socket.id}`);
        
        socket.emit("authenticated", { success: true, userId });
      }
    });

    // Suscribirse a departamento específico
    socket.on("subscribe_department", (departmentId: string) => {
      socket.join(`department:${departmentId}`);
      console.log(`[WebSocket] Socket ${socket.id} subscribed to department ${departmentId}`);
    });

    // Desconexión
    socket.on("disconnect", () => {
      const userId = socket.data.userId;
      if (userId && connectedUsers.has(userId)) {
        connectedUsers.get(userId)!.delete(socket.id);
        if (connectedUsers.get(userId)!.size === 0) {
          connectedUsers.delete(userId);
        }
      }
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  console.log("[WebSocket] Server initialized");
  return io;
}

// Emitir evento a usuario específico
export function emitToUser(userId: string, event: RealtimeEvent): void {
  if (io) {
    io.to(`user:${userId}`).emit("realtime_event", event);
    console.log(`[WebSocket] Emitted ${event.type} to user ${userId}`);
  }
}

// Emitir evento a departamento
export function emitToDepartment(departmentId: string, event: RealtimeEvent): void {
  if (io) {
    io.to(`department:${departmentId}`).emit("realtime_event", event);
    console.log(`[WebSocket] Emitted ${event.type} to department ${departmentId}`);
  }
}

// Emitir evento global (para admins/dashboards)
export function emitGlobal(event: RealtimeEvent): void {
  if (io) {
    io.to("global").emit("realtime_event", event);
    console.log(`[WebSocket] Emitted ${event.type} globally`);
  }
}

// Obtener número de usuarios conectados
export function getConnectedUsersCount(): number {
  return connectedUsers.size;
}

// Verificar si un usuario está conectado
export function isUserConnected(userId: string): boolean {
  return connectedUsers.has(userId) && connectedUsers.get(userId)!.size > 0;
}

// Obtener instancia de Socket.IO
export function getIO(): Server | null {
  return io;
}

// Helper functions para emitir eventos específicos
export const realtimeEvents = {
  fwiUpdate: (userId: string, score: number, change: number) => {
    emitToUser(userId, { type: "fwi_update", userId, score, change });
    emitGlobal({ type: "fwi_update", userId, score, change });
  },
  
  treepointsUpdate: (userId: string, balance: number, change: number, reason: string) => {
    emitToUser(userId, { type: "treepoints_update", userId, balance, change, reason });
  },
  
  alertTriggered: (alertId: string, title: string, severity: "low" | "medium" | "high" | "critical") => {
    emitGlobal({ type: "alert_triggered", alertId, title, severity });
  },
  
  ewaStatusUpdate: (requestId: string, status: "approved" | "rejected", userId: string) => {
    emitToUser(userId, { type: "ewa_status", requestId, status, userId });
    emitGlobal({ type: "ewa_status", requestId, status, userId });
  },
  
  goalProgress: (userId: string, goalId: string, progress: number, completed: boolean) => {
    emitToUser(userId, { type: "goal_progress", userId, goalId, progress, completed });
  },
  
  newTransaction: (userId: string, amount: number, category: string) => {
    emitToUser(userId, { type: "new_transaction", userId, amount, category });
  },
  
  leaderboardChange: (userId: string, newRank: number, previousRank: number) => {
    emitToUser(userId, { type: "leaderboard_change", userId, newRank, previousRank });
    emitGlobal({ type: "leaderboard_change", userId, newRank, previousRank });
  },
  
  badgeEarned: (userId: string, badgeId: string, badgeName: string) => {
    emitToUser(userId, { type: "badge_earned", userId, badgeId, badgeName });
    emitGlobal({ type: "badge_earned", userId, badgeId, badgeName });
  }
};
