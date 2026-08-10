import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// All business logic for tasks lives here — the controller stays thin
// and just wires HTTP requests to these methods.
//
// Every method takes a `userId` because tasks are scoped per guest
// session (see Section I of the plan): a guest should only ever see
// and modify their own tasks, never another guest's.
@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        userId,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    // Reuses findOne so a user can't update a task that isn't theirs —
    // this throws NotFoundException before any update is attempted.
    await this.findOne(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.task.delete({ where: { id } });

    return { message: 'Task deleted successfully' };
  }
}
