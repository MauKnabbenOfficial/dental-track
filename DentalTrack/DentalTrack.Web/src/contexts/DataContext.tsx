import type { ReactNode } from "react";
import { ApiDataProvider, useApiData } from "./ApiDataContext";

export function DataProvider({ children }: { children: ReactNode }) {
  // Always use the API-backed provider; runtime mocks were removed.
  return <ApiDataProvider>{children}</ApiDataProvider>;
}

export function useData() {
  return useApiData();
}

// Re-export types and helpers from ApiDataContext for consumers
export * from "./ApiDataContext";
