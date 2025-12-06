/**
 * Utilitários para simulação de comportamento assíncrono nos mocks
 * Simula latência de rede e comportamentos da API
 */

/**
 * Simula delay de rede
 */
export function simulateDelay(ms: number = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gera um ID único
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Simula paginação em um array
 */
export function paginate<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: items.slice(start, end),
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Filtra items por texto em múltiplos campos
 */
export function filterByText<T>(
  items: T[],
  search: string,
  fields: (keyof T)[]
): T[] {
  if (!search) return items;

  const searchLower = search.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => {
      const value = (item as Record<string, unknown>)[field as string];
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchLower);
      }
      return false;
    })
  );
}

/**
 * Ordena items por campo
 */
export function sortBy<T>(
  items: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === bVal) return 0;
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    const comparison = aVal < bVal ? -1 : 1;
    return order === "asc" ? comparison : -comparison;
  });
}

/**
 * Classe base para gerenciamento de storage mock
 */
export class MockStorage<T extends { id: string }> {
  private storageKey: string;
  private initialData: T[];

  constructor(storageKey: string, initialData: T[]) {
    this.storageKey = storageKey;
    this.initialData = initialData;
  }

  private getStoredData(): T[] {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.initialData;
      }
    }
    return this.initialData;
  }

  private setStoredData(data: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getAll(): T[] {
    return this.getStoredData();
  }

  getById(id: string): T | undefined {
    return this.getStoredData().find((item) => item.id === id);
  }

  create(item: Omit<T, "id">): T {
    const data = this.getStoredData();
    const newItem = { ...item, id: generateId() } as T;
    data.push(newItem);
    this.setStoredData(data);
    return newItem;
  }

  update(id: string, updates: Partial<T>): T {
    const data = this.getStoredData();
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }

    data[index] = { ...data[index], ...updates };
    this.setStoredData(data);
    return data[index];
  }

  delete(id: string): void {
    const data = this.getStoredData();
    const filtered = data.filter((item) => item.id !== id);
    this.setStoredData(filtered);
  }

  reset(): void {
    this.setStoredData(this.initialData);
  }
}
