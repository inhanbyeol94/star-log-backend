import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaExtendedClient } from './prisma.extends';
import { PrismaConfig } from './prisma.config';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'info' | 'warn'> implements OnModuleInit {
  readonly extendedClient = prismaExtendedClient(this);
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    const { query, error, warn, info } = PrismaConfig.instance.options;

    error &&
      this.$on('error', (event) => {
        this.logger.error(event);
      });
    warn &&
      this.$on('warn', (event) => {
        this.logger.warn(event);
      });

    info &&
      this.$on('info', (event) => {
        this.logger.verbose(event);
      });

    query &&
      this.$on('query', (event) => {
        event.params === '[]' && this.logger.log(`\x1B[95m[Query]\x1B[39m \x1B[96m${event.query.replaceAll(`"public".`, '')}\x1B[39m \x1B[32m`);
        event.params !== '[]' &&
          this.logger.log(`\x1B[95m[Query]\x1B[39m \x1B[96m${event.query.replaceAll(`"public".`, '')}\x1B[39m \x1B[32m--- parameter\ ${event.params}\x1B[39m`);
      });

    await this.$connect();
  }
}
