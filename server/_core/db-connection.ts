import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../../drizzle/schema";
import { sql } from "drizzle-orm";

let db: any = null;
let pool: mysql.Pool | null = null;

/**
 * Get or create database connection pool
 * Implements connection pooling and SSL for production
 */
export async function getDatabase() {
  if (db) return db;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  try {
    // Parse DATABASE_URL (format: mysql://user:password@host:port/database)
    const url = new URL(databaseUrl);
    
    const poolConfig: mysql.PoolOptions = {
      host: url.hostname,
      port: parseInt(url.port || "3306"),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      // Connection pooling
      waitForConnections: true,
      connectionLimit: process.env.NODE_ENV === "production" ? 10 : 5,
      queueLimit: 0,
      // Keep-alive settings
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      // SSL for production (Railway MySQL requires SSL)
      ssl: process.env.NODE_ENV === "production" ? "require" : undefined,
      // Timeout settings
      connectTimeout: 10000,
      // Charset
      charset: "utf8mb4",
    };

    console.log("[Database] Creating connection pool with config:", {
      host: poolConfig.host,
      port: poolConfig.port,
      database: poolConfig.database,
      ssl: poolConfig.ssl,
      connectionLimit: poolConfig.connectionLimit,
    });

    pool = mysql.createPool(poolConfig);
    
    db = drizzle(pool, { schema, mode: "default" });
    
    console.log("[Database] ✓ Connection pool created successfully");
    
    // Test connection
    const connection = await pool.getConnection();
    try {
      await connection.ping();
      console.log("[Database] ✓ Connection test passed");
    } finally {
      connection.release();
    }
    
    return db;
  } catch (error) {
    console.error("[Database] ✗ Connection failed:", error);
    throw error;
  }
}

/**
 * Close database connection pool gracefully
 */
export async function closeDatabase() {
  if (pool) {
    try {
      await pool.end();
      console.log("[Database] ✓ Connection pool closed");
      pool = null;
      db = null;
    } catch (error) {
      console.error("[Database] ✗ Error closing pool:", error);
    }
  }
}
