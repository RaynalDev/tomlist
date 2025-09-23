export interface PlanningSlot {
  start: string;
  end: string;
  score: number;
}

export interface SuggestPlanningPayload {
  taskId: string;
  durationMin?: number;
}

export interface PlanningSuggestionResponse {
  options: PlanningSlot[];
}
