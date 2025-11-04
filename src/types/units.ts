export interface Unit {
  id: number;
  name: string;
  description?: string;
}

export type UnitListApiResponse = Unit[];
