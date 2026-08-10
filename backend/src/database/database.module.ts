import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Wraps PrismaService as a module so other modules (tasks, auth)
// can import it and inject PrismaService via constructor DI,
// rather than each module recreating its own database connection.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
