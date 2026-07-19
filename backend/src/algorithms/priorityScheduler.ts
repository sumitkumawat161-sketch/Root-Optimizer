export interface SchedulableStop {
  id: string;
  priority: number;
  demandKg: number;
}

export function priorityScheduleStops<T extends SchedulableStop>(stops: T[]): T[] {
  return [...stops].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.demandKg - a.demandKg;
  });
}
