import { Module } from '@nestjs/common';
import { NotesModule } from './modules/notes/notes.module';
import { PlanningModule } from './modules/planning/planning.module';
import { SharedModule } from './shared/shared.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [SharedModule, TasksModule, NotesModule, PlanningModule],
})
export class AppModule {}
