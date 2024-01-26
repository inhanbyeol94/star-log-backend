import { IPrismaLoggerConfig } from './types/config.interface';

export class PrismaConfig {
  public static instance: PrismaConfig;
  private constructor(public readonly options: IPrismaLoggerConfig) {}

  public static LoggerInstance(options: IPrismaLoggerConfig): PrismaConfig {
    if (!this.instance) this.instance = new PrismaConfig(options);
    return this.instance;
  }
}
