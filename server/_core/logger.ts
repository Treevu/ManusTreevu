/**
 * Logger utility for structured logging in production
 * Supports different log levels: debug, info, warn, error
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel = LOG_LEVELS[
  (process.env.LOG_LEVEL as LogLevel) || "info"
];

interface LogContext {
  [key: string]: any;
}

function formatLog(level: string, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  const env = process.env.NODE_ENV || "development";
  
  const logEntry = {
    timestamp,
    level,
    message,
    env,
    ...(context && Object.keys(context).length > 0 && { context }),
  };
  
  // In production, output as JSON for easier parsing
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(logEntry);
  }
  
  // In development, output human-readable format
  const contextStr = context && Object.keys(context).length > 0 
    ? ` ${JSON.stringify(context)}` 
    : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (LOG_LEVELS.debug >= currentLogLevel) {
      console.log(formatLog("DEBUG", message, context));
    }
  },
  
  info: (message: string, context?: LogContext) => {
    if (LOG_LEVELS.info >= currentLogLevel) {
      console.log(formatLog("INFO", message, context));
    }
  },
  
  warn: (message: string, context?: LogContext) => {
    if (LOG_LEVELS.warn >= currentLogLevel) {
      console.warn(formatLog("WARN", message, context));
    }
  },
  
  error: (message: string, error?: Error | LogContext, context?: LogContext) => {
    if (LOG_LEVELS.error >= currentLogLevel) {
      let errorContext = context;
      let errorMessage = message;
      
      if (error instanceof Error) {
        errorContext = {
          error: {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
          },
          ...context,
        };
      } else if (error && typeof error === "object") {
        errorContext = { ...error, ...context };
      }
      
      console.error(formatLog("ERROR", errorMessage, errorContext));
    }
  },
};

/**
 * Express middleware for logging requests
 */
export function requestLogger(req: any, res: any, next: any) {
  const startTime = Date.now();
  
  // Log request
  logger.debug(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  
  // Log response
  const originalSend = res.send;
  res.send = function(data: any) {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path} ${res.statusCode}`, {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
    return originalSend.call(this, data);
  };
  
  next();
}
