import dayjs from 'dayjs/esm';

import { IClaim, NewClaim } from './claim.model';

export const sampleWithRequiredData: IClaim = {
  id: 22368,
};

export const sampleWithPartialData: IClaim = {
  id: 19315,
  dateFiled: dayjs('2023-10-23'),
  status: 'Androgynous',
};

export const sampleWithFullData: IClaim = {
  id: 30498,
  dateFiled: dayjs('2023-10-23'),
  status: 'syndicate eius Electronic',
  claimType: 'while',
  hours: 10302,
};

export const sampleWithNewData: NewClaim = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
