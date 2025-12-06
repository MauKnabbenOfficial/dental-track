import React, { createContext, useContext, useMemo } from "react";
import { IUserService } from "./interfaces/IUserService";
import { IPatientService } from "./interfaces/IPatientService";
import {
  IProcedureTemplateService,
  IProcedureTemplateStageService,
  IStageTemplateService,
} from "./interfaces/IProcedureTemplateService";
import {
  ITreatmentService,
  ITreatmentStageService,
} from "./interfaces/ITreatmentService";
import { IFinancialService } from "./interfaces/IFinancialService";
import { IAuthService } from "./interfaces/IAuthService";

// Mock implementations
import {
  MockUserService,
  MockPatientService,
  MockProcedureTemplateService,
  MockProcedureTemplateStageService,
  MockStageTemplateService,
  MockTreatmentService,
  MockTreatmentStageService,
  MockFinancialService,
  MockAuthService,
} from "./mock";

// API implementations
import {
  ApiUserService,
  ApiPatientService,
  ApiProcedureTemplateService,
  ApiProcedureTemplateStageService,
  ApiStageTemplateService,
  ApiTreatmentService,
  ApiTreatmentStageService,
  ApiFinancialService,
  ApiAuthService,
} from "./api";

/**
 * Interface que define todos os serviços disponíveis
 */
export interface IServiceRegistry {
  userService: IUserService;
  patientService: IPatientService;
  procedureTemplateService: IProcedureTemplateService;
  procedureTemplateStageService: IProcedureTemplateStageService;
  stageTemplateService: IStageTemplateService;
  treatmentService: ITreatmentService;
  treatmentStageService: ITreatmentStageService;
  financialService: IFinancialService;
  authService: IAuthService;
}

/**
 * Tipo de implementação: Mock ou API
 */
export type ServiceImplementationType = "mock" | "api";

/**
 * Cria o registro de serviços baseado no tipo de implementação
 */
function createServiceRegistry(
  type: ServiceImplementationType
): IServiceRegistry {
  if (type === "api") {
    return {
      userService: ApiUserService,
      patientService: ApiPatientService,
      procedureTemplateService: ApiProcedureTemplateService,
      procedureTemplateStageService: ApiProcedureTemplateStageService,
      stageTemplateService: ApiStageTemplateService,
      treatmentService: ApiTreatmentService,
      treatmentStageService: ApiTreatmentStageService,
      financialService: ApiFinancialService,
      authService: ApiAuthService,
    };
  }

  // Default: Mock
  return {
    userService: MockUserService,
    patientService: MockPatientService,
    procedureTemplateService: MockProcedureTemplateService,
    procedureTemplateStageService: MockProcedureTemplateStageService,
    stageTemplateService: MockStageTemplateService,
    treatmentService: MockTreatmentService,
    treatmentStageService: MockTreatmentStageService,
    financialService: MockFinancialService,
    authService: MockAuthService,
  };
}

/**
 * Contexto React para os serviços
 */
const ServiceContext = createContext<IServiceRegistry | null>(null);

/**
 * Props do ServiceProvider
 */
interface ServiceProviderProps {
  children: React.ReactNode;
  /**
   * Força um tipo específico de implementação.
   * Se não fornecido, usa a variável de ambiente VITE_USE_MOCK.
   */
  forceType?: ServiceImplementationType;
}

/**
 * Determina o tipo de implementação baseado nas variáveis de ambiente
 */
function getImplementationType(
  forceType?: ServiceImplementationType
): ServiceImplementationType {
  if (forceType) {
    return forceType;
  }

  // Verifica variável de ambiente
  const useMock = import.meta.env.VITE_USE_MOCK;

  // Se VITE_USE_MOCK for 'false', usa API
  if (useMock === "false") {
    return "api";
  }

  // Default: usa Mock
  return "mock";
}

/**
 * Provider de serviços que implementa o Strategy Pattern.
 * Fornece Mock ou API implementation baseado na configuração.
 *
 * @example
 * // No App.tsx
 * <ServiceProvider>
 *   <App />
 * </ServiceProvider>
 *
 * // Para forçar um tipo específico (útil para testes)
 * <ServiceProvider forceType="mock">
 *   <App />
 * </ServiceProvider>
 */
export function ServiceProvider({ children, forceType }: ServiceProviderProps) {
  const services = useMemo(() => {
    const type = getImplementationType(forceType);
    console.log(`[ServiceProvider] Using ${type.toUpperCase()} implementation`);
    return createServiceRegistry(type);
  }, [forceType]);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}

/**
 * Hook para acessar os serviços
 *
 * @example
 * const { userService, patientService } = useServices();
 * const users = await userService.getAll();
 */
export function useServices(): IServiceRegistry {
  const context = useContext(ServiceContext);

  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider");
  }

  return context;
}

/**
 * Hooks individuais para cada serviço (alternativa ao useServices)
 */
export function useUserService(): IUserService {
  return useServices().userService;
}

export function usePatientService(): IPatientService {
  return useServices().patientService;
}

export function useProcedureTemplateService(): IProcedureTemplateService {
  return useServices().procedureTemplateService;
}

export function useProcedureTemplateStageService(): IProcedureTemplateStageService {
  return useServices().procedureTemplateStageService;
}

export function useStageTemplateService(): IStageTemplateService {
  return useServices().stageTemplateService;
}

export function useTreatmentService(): ITreatmentService {
  return useServices().treatmentService;
}

export function useTreatmentStageService(): ITreatmentStageService {
  return useServices().treatmentStageService;
}

export function useFinancialService(): IFinancialService {
  return useServices().financialService;
}

export function useAuthService(): IAuthService {
  return useServices().authService;
}
