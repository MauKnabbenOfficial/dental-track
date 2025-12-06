/**
 * Interface base para todos os serviços CRUD
 * Implementa o padrão Repository para abstração de dados
 */
export interface IBaseService<
  T,
  TCreate = Omit<T, "id">,
  TUpdate = Partial<T>
> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * Resultado paginado para listagens
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Opções de filtro para listagens
 */
export interface FilterOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Resultado de operação com status
 */
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
