import { Injectable, OnModuleInit } from '@nestjs/common';
import { prismaExtendedClient } from './prisma.extends';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  readonly extendedClient = prismaExtendedClient(this);

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  constructor() {
    super();

    new Proxy(this, {
      get: (target, property) => Reflect.get(property in this.extendedClient ? this.extendedClient : target, property),
    });
  }
}
