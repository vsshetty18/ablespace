import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// Guest login is intentionally simple: no password, no email.
// Calling this creates a brand-new disposable User row and returns
// its id — the frontend then stores that id and sends it back on
// every task request via the x-user-id header (see tasks.controller.ts).
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createGuestSession() {
    const guestNumber = Math.floor(1000 + Math.random() * 9000);

    const user = await this.prisma.user.create({
      data: {
        name: `Guest-${guestNumber}`,
        isGuest: true,
      },
    });

    return {
      userId: user.id,
      name: user.name,
    };
  }
}
