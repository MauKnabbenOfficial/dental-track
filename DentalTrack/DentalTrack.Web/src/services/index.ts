// Service Interfaces
export * from "./interfaces";

// HTTP Client
export * from "./http";

// Mock Implementations
// export * from "./mock";

// API Implementations
export * from "./api";

// Service Provider (Strategy Pattern)
export {
  ServiceProvider,
  useServices,
  useUserService,
  usePatientService,
  useProcedureTemplateService,
  useProcedureTemplateStageService,
  useStageTemplateService,
  useTreatmentService,
  useTreatmentStageService,
  useFinancialService,
  useAuthService,
} from "./ServiceProvider";

export type {
  IServiceRegistry,
  ServiceImplementationType,
} from "./ServiceProvider";
