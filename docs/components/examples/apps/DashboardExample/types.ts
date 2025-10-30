export interface Stat {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}

export interface Project {
  id: number;
  name: string;
  progress: number;
  dueDate: string;
  status: string;
  team: string[];
}
