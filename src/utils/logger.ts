import { createLogger, format, transports } from 'winston';
import { join } from 'path';

// Define log entry interface
export interface AuthLogEntry {
  event: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'SESSION_START' | 'SESSION_END' | 'ERROR';
  walletAddress?: string;
  error?: string;
  sessionId?: string;
  details?: Record<string, unknown>;
}

// Create logger instance
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    // Console transport for development
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    // File transport for persistent storage
    new transports.File({
      filename: join(process.cwd(), 'logs', 'auth.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Separate file for errors
    new transports.File({
      filename: join(process.cwd(), 'logs', 'auth-error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// Helper functions for different types of logs
export const logAuthEvent = (entry: AuthLogEntry) => {
  if (entry.event === 'ERROR' || entry.event === 'LOGIN_FAILURE') {
    logger.error('Auth Event', entry);
  } else {
    logger.info('Auth Event', entry);
  }
};

export const logLoginAttempt = (walletAddress: string, details?: Record<string, unknown>) => {
  logAuthEvent({
    event: 'LOGIN_ATTEMPT',
    walletAddress,
    details
  });
};

export const logLoginSuccess = (walletAddress: string, sessionId: string, details?: Record<string, unknown>) => {
  logAuthEvent({
    event: 'LOGIN_SUCCESS',
    walletAddress,
    sessionId,
    details
  });
};

export const logLoginFailure = (walletAddress: string, error: string, details?: Record<string, unknown>) => {
  logAuthEvent({
    event: 'LOGIN_FAILURE',
    walletAddress,
    error,
    details
  });
};

export const logLogout = (walletAddress: string, sessionId: string) => {
  logAuthEvent({
    event: 'LOGOUT',
    walletAddress,
    sessionId
  });
};

export const logSessionStart = (walletAddress: string, sessionId: string) => {
  logAuthEvent({
    event: 'SESSION_START',
    walletAddress,
    sessionId
  });
};

export const logSessionEnd = (walletAddress: string, sessionId: string) => {
  logAuthEvent({
    event: 'SESSION_END',
    walletAddress,
    sessionId
  });
};

export const logError = (error: string, walletAddress?: string, details?: Record<string, unknown>) => {
  logAuthEvent({
    event: 'ERROR',
    walletAddress,
    error,
    details
  });
};

export default logger; 