export interface IModule {
  id: number;
  name?: string | null;
  acronym?: string | null;
  npalId?: string | null;
  npalCatalog?: string | null;
  semester?: string | null;
}

export type NewModule = Omit<IModule, 'id'> & { id: null };
