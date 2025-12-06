import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, context?: string, metadata?: Record<string, any>) {
    const ctx = context || this.context || 'Application';
    console.log(`[${ctx}] ${message}`, metadata ? JSON.stringify(metadata) : '');
  }

  error(message: string, context?: string, trace?: string) {
    const ctx = context || this.context || 'Application';
    console.error(`[${ctx}] ERROR: ${message}`, trace || '');
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    const ctx = context || this.context || 'Application';
    console.warn(`[${ctx}] WARN: ${message}`, metadata ? JSON.stringify(metadata) : '');
  }

  debug(message: string, context?: string) {
    const ctx = context || this.context || 'Application';
    console.debug(`[${ctx}] DEBUG: ${message}`);
  }

  verbose(message: string, context?: string) {
    const ctx = context || this.context || 'Application';
    console.log(`[${ctx}] VERBOSE: ${message}`);
  }
}


