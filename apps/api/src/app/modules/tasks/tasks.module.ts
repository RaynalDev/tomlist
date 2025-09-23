import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [SharedModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
