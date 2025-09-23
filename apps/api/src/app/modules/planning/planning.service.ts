import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  PlanningSuggestionResponse,
  PlanningSlot,
} from '@tomlist/domain';
import { CreateIcsDto } from './dto/create-ics.dto';

@Injectable()
export class PlanningService {
  suggest(taskId: string, durationMin = 45): PlanningSuggestionResponse {
    const start = this.roundToNextQuarterHour(new Date());
    const options: PlanningSlot[] = Array.from({ length: 3 }, (_, index) => {
      const slotStart = new Date(
        start.getTime() + index * (durationMin + 15) * 60000
      );
      const slotEnd = new Date(slotStart.getTime() + durationMin * 60000);
      return {
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        score: Math.max(1, 3 - index),
      };
    });

    return {
      options,
    };
  }

  createIcs(payload: CreateIcsDto): string {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Tomlist//MVP//FR',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${randomUUID()}`,
      `DTSTAMP:${this.formatDate(new Date())}`,
      `DTSTART:${this.formatDate(new Date(payload.start))}`,
      `DTEND:${this.formatDate(new Date(payload.end))}`,
      `SUMMARY:${this.escape(payload.title)}`,
    ];

    if (payload.description) {
      lines.push(`DESCRIPTION:${this.escape(payload.description)}`);
    }

    lines.push('END:VEVENT', 'END:VCALENDAR');
    return lines.join('\r\n');
  }

  private roundToNextQuarterHour(date: Date): Date {
    const result = new Date(date);
    result.setSeconds(0, 0);
    const minutes = result.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      result.setMinutes(minutes + (15 - remainder));
    }
    return result;
  }

  private formatDate(date: Date): string {
    const pad = (value: number) => `${value}`.padStart(2, '0');
    return [
      date.getUTCFullYear(),
      pad(date.getUTCMonth() + 1),
      pad(date.getUTCDate()),
      'T',
      pad(date.getUTCHours()),
      pad(date.getUTCMinutes()),
      pad(date.getUTCSeconds()),
      'Z',
    ].join('');
  }

  private escape(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,');
  }
}
