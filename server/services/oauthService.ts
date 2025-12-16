import { getDb } from '../db';
import { oauthAccounts, oauthSessions, users } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Tipos de proveedores OAuth soportados
 */
export type OAuthProvider = 'google' | 'github' | 'microsoft';

/**
 * Interfaz para perfil OAuth
 */
export interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope?: string;
  tokenType?: string;
  idToken?: string;
}

/**
 * Interfaz para respuesta de autenticación
 */
export interface AuthResponse {
  success: boolean;
  userId?: number;
  user?: any;
  sessionToken?: string;
  message: string;
  error?: string;
}

/**
 * Servicio de OAuth
 */
export class OAuthService {
  /**
   * Procesar login/signup con OAuth
   */
  static async handleOAuthCallback(
    provider: OAuthProvider,
    profile: OAuthProfile,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthResponse> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // Buscar cuenta OAuth existente
      const existingAccount = await db.query.oauthAccounts.findFirst({
        where: and(
          eq(oauthAccounts.provider, provider),
          eq(oauthAccounts.providerAccountId, profile.id)
        ),
      });

      let userId: number;

      if (existingAccount) {
        // Cuenta OAuth existente - actualizar tokens
        userId = existingAccount.userId;

        await db
          .update(oauthAccounts)
          .set({
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
            expiresAt: profile.expiresAt,
            lastUsedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(oauthAccounts.id, existingAccount.id));

        console.log(`✅ OAuth ${provider} updated for user ${userId}`);
      } else {
        // Buscar usuario por email
        let user = await db.query.users.findFirst({
          where: eq(users.email, profile.email),
        });

        if (!user) {
          // Crear nuevo usuario
          const result = await db.insert(users).values({
            openId: `oauth-${provider}-${profile.id}`,
            name: profile.name,
            email: profile.email,
            loginMethod: provider,
            role: 'employee',
            status: 'active',
          });

          userId = result.insertId as number;
          console.log(`✅ New user created: ${userId}`);
        } else {
          userId = user.id;
        }

        // Crear nueva cuenta OAuth
        await db.insert(oauthAccounts).values({
          userId,
          provider,
          providerAccountId: profile.id,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
          expiresAt: profile.expiresAt,
          scope: profile.scope,
          tokenType: profile.tokenType,
          idToken: profile.idToken,
          isLinked: true,
          isPrimary: true,
        });

        console.log(`✅ OAuth ${provider} account linked to user ${userId}`);
      }

      // Crear sesión OAuth
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días

      await db.insert(oauthSessions).values({
        userId,
        provider,
        sessionToken,
        expiresAt,
        userAgent,
        ipAddress,
        isActive: true,
      });

      // Obtener usuario actualizado
      const updatedUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      return {
        success: true,
        userId,
        user: updatedUser,
        sessionToken,
        message: `Autenticado con ${provider}`,
      };
    } catch (error) {
      console.error(`Error handling ${provider} OAuth callback:`, error);
      return {
        success: false,
        message: 'Error en autenticación OAuth',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Vincular cuenta OAuth adicional a usuario existente
   */
  static async linkOAuthAccount(
    userId: number,
    provider: OAuthProvider,
    profile: OAuthProfile
  ): Promise<AuthResponse> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // Verificar que el usuario existe
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        return {
          success: false,
          message: 'Usuario no encontrado',
        };
      }

      // Verificar que la cuenta OAuth no esté vinculada a otro usuario
      const existingAccount = await db.query.oauthAccounts.findFirst({
        where: and(
          eq(oauthAccounts.provider, provider),
          eq(oauthAccounts.providerAccountId, profile.id)
        ),
      });

      if (existingAccount && existingAccount.userId !== userId) {
        return {
          success: false,
          message: 'Esta cuenta OAuth ya está vinculada a otro usuario',
        };
      }

      if (existingAccount) {
        // Actualizar cuenta existente
        await db
          .update(oauthAccounts)
          .set({
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
            expiresAt: profile.expiresAt,
            isLinked: true,
            updatedAt: new Date(),
          })
          .where(eq(oauthAccounts.id, existingAccount.id));
      } else {
        // Crear nueva vinculación
        await db.insert(oauthAccounts).values({
          userId,
          provider,
          providerAccountId: profile.id,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
          expiresAt: profile.expiresAt,
          scope: profile.scope,
          tokenType: profile.tokenType,
          idToken: profile.idToken,
          isLinked: true,
          isPrimary: false,
        });
      }

      console.log(`✅ OAuth ${provider} linked to user ${userId}`);

      return {
        success: true,
        userId,
        message: `Cuenta ${provider} vinculada exitosamente`,
      };
    } catch (error) {
      console.error(`Error linking ${provider} OAuth:`, error);
      return {
        success: false,
        message: 'Error al vincular cuenta OAuth',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Desvincular cuenta OAuth
   */
  static async unlinkOAuthAccount(
    userId: number,
    provider: OAuthProvider
  ): Promise<AuthResponse> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // Obtener todas las cuentas del usuario
      const accounts = await db.query.oauthAccounts.findMany();
      const userAccounts = accounts.filter((a: any) => a.userId === userId);

      // No permitir desvinculación si es la única cuenta
      if (userAccounts.length === 1) {
        return {
          success: false,
          message: 'No puedes desvincularte de tu única cuenta de autenticación',
        };
      }

      // Desvinculación
      const account = userAccounts.find((a: any) => a.provider === provider);
      if (!account) {
        return {
          success: false,
          message: `Cuenta ${provider} no encontrada`,
        };
      }

      await db
        .update(oauthAccounts)
        .set({
          isLinked: false,
          updatedAt: new Date(),
        })
        .where(eq(oauthAccounts.id, account.id));

      console.log(`✅ OAuth ${provider} unlinked from user ${userId}`);

      return {
        success: true,
        userId,
        message: `Cuenta ${provider} desvinculada`,
      };
    } catch (error) {
      console.error(`Error unlinking ${provider} OAuth:`, error);
      return {
        success: false,
        message: 'Error al desvincularse',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Obtener cuentas OAuth vinculadas de un usuario
   */
  static async getLinkedAccounts(userId: number): Promise<any[]> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      const accounts = await db.query.oauthAccounts.findMany();
      return accounts.filter((a: any) => a.userId === userId && a.isLinked);
    } catch (error) {
      console.error('Error getting linked accounts:', error);
      return [];
    }
  }

  /**
   * Validar y refrescar token OAuth
   */
  static async refreshOAuthToken(
    userId: number,
    provider: OAuthProvider
  ): Promise<{ success: boolean; accessToken?: string; expiresAt?: Date }> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      const account = await db.query.oauthAccounts.findFirst({
        where: and(
          eq(oauthAccounts.userId, userId),
          eq(oauthAccounts.provider, provider)
        ),
      });

      if (!account || !account.refreshToken) {
        return {
          success: false,
        };
      }

      // En producción, llamar a API del proveedor para refrescar token
      // Por ahora, simular renovación
      const newExpiresAt = new Date(Date.now() + 3600 * 1000); // 1 hora

      await db
        .update(oauthAccounts)
        .set({
          expiresAt: newExpiresAt,
          updatedAt: new Date(),
        })
        .where(eq(oauthAccounts.id, account.id));

      return {
        success: true,
        accessToken: account.accessToken,
        expiresAt: newExpiresAt,
      };
    } catch (error) {
      console.error('Error refreshing OAuth token:', error);
      return { success: false };
    }
  }

  /**
   * Generar token de sesión único
   */
  private static generateSessionToken(): string {
    return `oauth_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Validar sesión OAuth
   */
  static async validateSession(sessionToken: string): Promise<{
    valid: boolean;
    userId?: number;
    provider?: OAuthProvider;
  }> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      const session = await db.query.oauthSessions.findFirst({
        where: eq(oauthSessions.sessionToken, sessionToken),
      });

      if (!session || !session.isActive) {
        return { valid: false };
      }

      // Verificar que no haya expirado
      if (new Date(session.expiresAt) < new Date()) {
        await db
          .update(oauthSessions)
          .set({ isActive: false })
          .where(eq(oauthSessions.id, session.id));

        return { valid: false };
      }

      return {
        valid: true,
        userId: session.userId,
        provider: session.provider as OAuthProvider,
      };
    } catch (error) {
      console.error('Error validating session:', error);
      return { valid: false };
    }
  }
}
