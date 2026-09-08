type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

function formatLog(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  // Safe sanitized copy of context
  const safeContext = { ...context };

  // Ensure PII is not logged
  if ('email' in safeContext) delete safeContext.email;
  if ('whatsapp' in safeContext) delete safeContext.whatsapp;
  if ('name' in safeContext) delete safeContext.name;

  return JSON.stringify({
    timestamp,
    level,
    message,
    ...safeContext,
  });
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.log(formatLog('info', message, context));
  },
  warn(message: string, context?: LogContext) {
    console.warn(formatLog('warn', message, context));
  },
  error(message: string, context?: LogContext) {
    console.error(formatLog('error', message, context));
  },
};
