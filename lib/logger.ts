import pino from 'pino';

export const logger = pino({
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  } : undefined
});

export function logEvent(event: string, data?: any) {
  logger.info({ event, data }, event);
}

export function logError(error: Error, context?: string) {
  logger.error({ error: error.message, stack: error.stack, context });
}
