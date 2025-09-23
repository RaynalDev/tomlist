import { Body, Controller, Header, Post } from '@nestjs/common';
import { SuggestPlanningDto } from './dto/suggest-planning.dto';
import { PlanningService } from './planning.service';
import { CreateIcsDto } from './dto/create-ics.dto';

@Controller('planning')
export class PlanningController {
  constructor(private readonly planning: PlanningService) {}

  @Post('suggest')
  suggest(@Body() body: SuggestPlanningDto) {
    return this.planning.suggest(body.taskId, body.durationMin);
  }

  @Post('ics')
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  createIcs(@Body() body: CreateIcsDto) {
    return this.planning.createIcs(body);
  }
}
