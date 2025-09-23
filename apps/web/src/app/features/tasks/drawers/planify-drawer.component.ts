import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlanningSlot } from '@tomlist/domain';
import { PlanDrawerView } from '../state/task.store';

@Component({
  selector: 'app-planify-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planify-drawer.component.html',
  styleUrl: './planify-drawer.component.scss',
})
export class PlanifyDrawerComponent {
  @Input() plan: PlanDrawerView = null;
  @Output() close = new EventEmitter<void>();
  @Output() slotSelected = new EventEmitter<PlanningSlot>();

  trackOption(index: number): number {
    return index;
  }
}
