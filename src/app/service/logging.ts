import { inject, InjectionToken, Service } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
}

export const LOG_LEVEL = new InjectionToken<LogLevel>('LOG_LEVEL', {
  providedIn: 'root',
  factory: () => 'info',
});

export const LOG_CONTEXT = new InjectionToken<string>('LOG_CONTEXT', {
  providedIn: 'root',
  factory: () => 'App',
});

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

@Service({
  autoProvided: true,
  factory: () => {
    const minLevel = inject(LOG_LEVEL);
    const context = inject(LOG_CONTEXT);

    const history: LogEntry[] = [];

    const shouldLog = (level: LogLevel) => LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[minLevel];

    const write = (level: LogLevel, message: string, ctx = context) => {
      if (!shouldLog(level)) return;
      const entry: LogEntry = { level, message, timestamp: new Date(), context: ctx };
      history.push(entry);
      const prefix = `[${entry.timestamp.toISOString()}] [${ctx}] [${level.toUpperCase()}]`;
      console[level === 'debug' ? 'log' : level](`${prefix} ${message}`);
    };

    return {
      debug: (message: string, ctx?: string) => write('debug', message, ctx),
      info: (message: string, ctx?: string) => write('info', message, ctx),
      warn: (message: string, ctx?: string) => write('warn', message, ctx),
      error: (message: string, ctx?: string) => write('error', message, ctx),
      getHistory: () => [...history],
      clearHistory: () => history.splice(0),
    };
  },
})
export class LoggingService {
  debug!: (message: string, ctx?: string) => void;
  info!: (message: string, ctx?: string) => void;
  warn!: (message: string, ctx?: string) => void;
  error!: (message: string, ctx?: string) => void;
  getHistory!: () => LogEntry[];
  clearHistory!: () => void;
}
