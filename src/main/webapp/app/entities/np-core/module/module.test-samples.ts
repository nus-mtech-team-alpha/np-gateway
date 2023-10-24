import { IModule, NewModule } from './module.model';

export const sampleWithRequiredData: IModule = {
  id: 28793,
};

export const sampleWithPartialData: IModule = {
  id: 5254,
  name: 'Future',
  npalId: 'Bronze Liaison oof',
  npalCatalog: 'Hip photograph',
};

export const sampleWithFullData: IModule = {
  id: 16328,
  name: 'National',
  acronym: 'Checking',
  npalId: 'Southwest',
  npalCatalog: 'Applications Non Soft',
  semester: 'Legacy',
};

export const sampleWithNewData: NewModule = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
