import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ToggleItemDto } from './dto/toggle-item.dto';
import { InMemoryDatabase } from '../../database/in-memory.database';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notes: NotesService,
    private readonly db: InMemoryDatabase
  ) {}

  @Get()
  findAll() {
    return this.notes.list();
  }

  @Post()
  create(@Body() body: CreateNoteDto) {
    return this.notes.create({
      type: body.type,
      title: body.title,
      userId: this.db.getUserId(),
    });
  }

  @Post(':id/items')
  createItem(@Param('id') id: string, @Body() body: CreateItemDto) {
    return this.notes.createItem(id, body.label);
  }

  @Patch(':id/items/:itemId')
  toggleItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: ToggleItemDto
  ) {
    return this.notes.toggleItem(id, itemId, body.checked);
  }
}
