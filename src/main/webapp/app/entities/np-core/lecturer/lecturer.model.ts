export interface ILecturer {
  id: number;
  name?: string | null;
  email?: string | null;
  shortEmail?: string | null;
  workdayId?: string | null;
}

export type NewLecturer = Omit<ILecturer, 'id'> & { id: null };
