export type Urgency = 'NOW' | 'TODAY' | 'MARGIN';

export type EmotionalType = 'SATISFYING' | 'NORMAL' | 'BORING' | 'DRAINING';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'PAUSED';

export interface TaskData {
  id: string;
  urgency: Urgency;
  emotionalType: EmotionalType;
  deadline: Date | null;
  status: TaskStatus;
}
