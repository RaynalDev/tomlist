import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InMemoryDatabase } from '../../database/in-memory.database';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasks: TasksService,
    private readonly db: InMemoryDatabase
  ) {}

  @Get()
  findAll() {
    return this.tasks.list();
  }

  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.tasks.create({
      title: body.title,
      userId: this.db.getUserId(),
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    return this.tasks.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.tasks.remove(id);
    return { ok: true };
  }

  @Post(':id/decompose')
  decompose(@Param('id') id: string) {
    return this.tasks.decompose(id);
  }

  @Post('reorder')
  reorder(@Body() body: ReorderTasksDto) {
    return this.tasks.reorder(body.ids ?? []);
  }
}
