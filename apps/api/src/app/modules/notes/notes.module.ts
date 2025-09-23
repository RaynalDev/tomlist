import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [SharedModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
