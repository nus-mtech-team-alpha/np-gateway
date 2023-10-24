import dayjs from 'dayjs/esm';
import { ILecturer } from 'app/entities/np-core/lecturer/lecturer.model';
import { IModule } from 'app/entities/np-core/module/module.model';

export interface IClaim {
  id: number;
  dateFiled?: dayjs.Dayjs | null;
  status?: string | null;
  claimType?: string | null;
  hours?: number | null;
  lecturer?: Pick<ILecturer, 'id' | 'name'> | null;
  module?: Pick<IModule, 'id' | 'name'> | null;
}

export type NewClaim = Omit<IClaim, 'id'> & { id: null };
