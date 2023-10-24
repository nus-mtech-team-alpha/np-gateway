import { ILecturer, NewLecturer } from './lecturer.model';

export const sampleWithRequiredData: ILecturer = {
  id: 6528,
};

export const sampleWithPartialData: ILecturer = {
  id: 28953,
  name: 'Bike Uruguayo',
  shortEmail: 'Sedan Account mmm',
  workdayId: 'Future incidunt engine',
};

export const sampleWithFullData: ILecturer = {
  id: 16755,
  name: 'Bike Research',
  email: 'Danika_Lakin-Rempel50@gmail.com',
  shortEmail: 'Data virtual',
  workdayId: 'East meanwhile Beauty',
};

export const sampleWithNewData: NewLecturer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
