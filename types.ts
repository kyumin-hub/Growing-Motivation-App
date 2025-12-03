export interface Mission {
  id: string;
  text: string;
  xp: number;
  completed: boolean;
  isAiGenerated?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  color: string; // Tailwind color class string
  tasks: Mission[];
}

export enum PlantStage {
  SEED = 'SEED',
  SPROUT = 'SPROUT',
  SAPLING = 'SAPLING',
  FLOWER = 'FLOWER',
  TREE = 'TREE'
}

export interface CheeringMessage {
  id: string;
  text: string;
  author: string; // 'Anonymous' or 'AI'
  likes: number;
}

export type Tab = 'HOME' | 'MISSIONS' | 'STUDY' | 'COMMUNITY' | 'PLANNING';