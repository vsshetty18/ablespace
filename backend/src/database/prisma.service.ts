import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Wraps PrismaClient as a NestJS injectable service so it can be
// dependency-injected into any module (tasks, auth, etc.) instead of
// every file creating its own database connection.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // Connect explicitly on app startup so connection errors surface
    // immediately in logs rather than on the first incoming request.
    await this.$connect();
  }

  async onModuleDestroy() {
    // Close the connection cleanly when the app shuts down.
    await this.$disconnect();
  }
}
