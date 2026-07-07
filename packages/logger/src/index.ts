/**
 * Structured logging for NabhaVerse Studio.
 *
 * The logger is intentionally dependency-free and safe to use in both
 * browser and Node.js runtimes (it only relies on the global `console`).
 * Every log line is emitted as a single structured object so downstream
 * log aggregation (e.g. server logs shipped to a log pipeline) can parse
 * it reliably instead of scraping formatted strings.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

/** Arbitrary structured metadata attached to a log entry. */
export type LogMetadata = Record<string, unknown>;

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  [key: string]: unknown;
}

export interface LoggerOptions {
  /** Name of the module/service emitting logs, included on every entry. */
  context?: string;
  /** Minimum level that will be emitted. Defaults to "debug". */
  minLevel?: LogLevel;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CONSOLE_METHOD: Record<LogLevel, "debug" | "info" | "warn" | "error"> = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
};

/**
 * Structured logger. Use `createLogger` to obtain an instance scoped to a
 * module/service, or the shared `logger` singleton for ad-hoc logging.
 */
export class Logger {
  private readonly context?: string;
  private readonly minLevel: LogLevel;

  constructor(options: LoggerOptions = {}) {
    this.context = options.context;
    this.minLevel = options.minLevel ?? "debug";
  }

  /** Creates a child logger that inherits this logger's settings with a nested context. */
  child(context: string): Logger {
    const nestedContext = this.context ? `${this.context}:${context}` : context;
    return new Logger({ context: nestedContext, minLevel: this.minLevel });
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.log("debug", message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.log("info", message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.log("warn", message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.log("error", message, metadata);
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[this.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(this.context ? { context: this.context } : {}),
      ...metadata,
    };

    console[CONSOLE_METHOD[level]](entry);
  }
}

/** Creates a new `Logger` scoped to the given context. */
export function createLogger(context?: string, options?: Omit<LoggerOptions, "context">): Logger {
  return new Logger({ ...options, context });
}

/** Shared, unscoped logger instance for quick usage. */
export const logger = new Logger();
