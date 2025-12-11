// Base interfaces
export * from "./IBaseService";

// Service interfaces
export * from "./IUserService";
export * from "./IPatientService";
export * from "./IProcedureTemplateService";
export * from "./ITreatmentService";
export * from "./IFinancialService";
export * from "./IAuthService";

/**
 * Agregador de todos os serviços da aplicação
 * Usado pelo ServiceProvider para injetar as implementações
 */
export interface IServiceContainer {
  userService: import("./IUserService").IUserService;
  patientService: import("./IPatientService").IPatientService;
  procedureTemplateService: import("./IProcedureTemplateService").IProcedureTemplateService;
  procedureTemplateStageService: import("./IProcedureTemplateService").IProcedureTemplateStageService;
  stageTemplateService: import("./IProcedureTemplateService").IStageTemplateService;
  treatmentService: import("./ITreatmentService").ITreatmentService;
  treatmentStageService: import("./ITreatmentService").ITreatmentStageService;
  financialService: import("./IFinancialService").IFinancialService;
  authService: import("./IAuthService").IAuthService;
}
