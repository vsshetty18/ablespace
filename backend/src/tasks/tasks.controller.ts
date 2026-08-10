import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Thin controller: only responsible for reading the HTTP request
// (params, body, headers) and handing off to TasksService.
// No business logic or database calls happen here.
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Every request must carry the guest user's id in a header —
  // set by the frontend after guest login (see auth module).
  // This is the simplest possible way to scope requests per-guest
  // without a full session/cookie/JWT-middleware setup.
  private getUserId(userId: string | undefined): string {
    if (!userId) {
      throw new UnauthorizedException('Missing x-user-id header. Please log in as guest first.');
    }
    return userId;
  }

  @Get()
  findAll(@Headers('x-user-id') userId: string) {
    return this.tasksService.findAll(this.getUserId(userId));
  }

  @Get(':id')
  findOne(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    return this.tasksService.findOne(this.getUserId(userId), id);
  }

  @Post()
  create(@Headers('x-user-id') userId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(this.getUserId(userId), dto);
  }

  @Patch(':id')
  update(
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(this.getUserId(userId), id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    return this.tasksService.remove(this.getUserId(userId), id);
  }
}
