import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from '@tomlist/domain';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;

  @Output() toggleDone = new EventEmitter<void>();
  @Output() togglePin = new EventEmitter<void>();
  @Output() decompose = new EventEmitter<void>();
  @Output() planify = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  onPlanify(): void {
    this.planify.emit();
  }

  onDecompose(): void {
    this.decompose.emit();
  }

  onRemove(): void {
    this.remove.emit();
  }
}
