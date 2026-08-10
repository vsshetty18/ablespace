import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

// PATCH /tasks/:id should allow updating any subset of fields
// (e.g. just the status when dragging a card between columns).
// PartialType takes CreateTaskDto and makes every field optional,
// while keeping all the same validation rules for whichever fields
// ARE present — no need to duplicate the decorators.
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
