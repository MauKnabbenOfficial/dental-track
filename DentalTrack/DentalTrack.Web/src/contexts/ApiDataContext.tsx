import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import {
  User,
  Patient,
  ProcedureTemplate,
  ProcedureTemplateStage,
  Treatment,
  TreatmentStage,
  FinancialRecord,
} from "@/data/mockData";
import { useServices } from "@/services";

// Extended FinancialRecord with new fields
export interface ExtendedFinancialRecord extends FinancialRecord {
  paymentDate?: string;
  status: "pending" | "paid" | "cancelled";
  responsibleType: "patient" | "clinic";
  patientId?: string;
  createdBy: string;
}

// Stage Template for reusable stages
export interface StageTemplate {
  id: string;
  name: string;
  description: string;
  defaultDuration: number;
  checklistItems: string[];
}

interface DataContextType {
  // Loading state
  isLoading: boolean;

  // Users
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Patients
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Procedure Templates
  procedureTemplates: ProcedureTemplate[];
  addProcedureTemplate: (template: ProcedureTemplate) => void;
  updateProcedureTemplate: (
    id: string,
    template: Partial<ProcedureTemplate>
  ) => void;
  deleteProcedureTemplate: (id: string) => void;

  // Procedure Template Stages
  procedureTemplateStages: ProcedureTemplateStage[];
  addProcedureTemplateStage: (stage: ProcedureTemplateStage) => void;
  updateProcedureTemplateStage: (
    id: string,
    stage: Partial<ProcedureTemplateStage>
  ) => void;
  deleteProcedureTemplateStage: (id: string) => void;
  swapProcedureTemplateStageOrder: (stageId1: string, stageId2: string) => void;

  // Stage Templates (mantido local por enquanto - não tem no backend)
  stageTemplates: StageTemplate[];
  addStageTemplate: (template: StageTemplate) => void;
  updateStageTemplate: (id: string, template: Partial<StageTemplate>) => void;
  deleteStageTemplate: (id: string) => void;

  // Treatments
  treatments: Treatment[];
  addTreatment: (treatment: Treatment) => void;
  updateTreatment: (id: string, treatment: Partial<Treatment>) => void;
  deleteTreatment: (id: string) => void;

  // Treatment Stages
  treatmentStages: TreatmentStage[];
  addTreatmentStage: (stage: TreatmentStage) => void;
  updateTreatmentStage: (id: string, stage: Partial<TreatmentStage>) => void;
  deleteTreatmentStage: (id: string) => void;

  // Financial Records
  financialRecords: ExtendedFinancialRecord[];
  addFinancialRecord: (record: ExtendedFinancialRecord) => void;
  updateFinancialRecord: (
    id: string,
    record: Partial<ExtendedFinancialRecord>
  ) => void;
  deleteFinancialRecord: (id: string) => void;

  // Helpers
  getPatientById: (id: string) => Patient | undefined;
  getTemplateById: (id: string) => ProcedureTemplate | undefined;
  getUserById: (id: string) => User | undefined;
  getStagesByTemplateId: (
    modeloProcedimentoId: string
  ) => ProcedureTemplateStage[];
  getStagesByTreatmentId: (treatmentId: string) => TreatmentStage[];
  getTreatmentsByPatientId: (patientId: string) => Treatment[];
  getFinancialByTreatmentId: (treatmentId: string) => ExtendedFinancialRecord[];
  generateId: () => string;

  // Refresh data
  refreshData: () => Promise<void>;
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial stage templates (local only)
const initialStageTemplates: StageTemplate[] = [
  {
    id: "st1",
    name: "Anestesia",
    description: "Aplicação de anestesia local",
    defaultDuration: 15,
    checklistItems: [
      "Verificar alergias",
      "Preparar material",
      "Aplicar anestésico",
    ],
  },
  {
    id: "st2",
    name: "Consulta Inicial",
    description: "Primeira avaliação do paciente",
    defaultDuration: 30,
    checklistItems: ["Anamnese", "Exame clínico", "Radiografias iniciais"],
  },
  {
    id: "st3",
    name: "Cirurgia",
    description: "Procedimento cirúrgico",
    defaultDuration: 90,
    checklistItems: [
      "Checklist pré-operatório",
      "Equipamentos",
      "Pós-operatório",
    ],
  },
  {
    id: "st4",
    name: "Retorno",
    description: "Consulta de acompanhamento",
    defaultDuration: 20,
    checklistItems: ["Avaliação cicatrização", "Orientações"],
  },
  {
    id: "st5",
    name: "Moldagem",
    description: "Tomada de moldes",
    defaultDuration: 30,
    checklistItems: ["Preparar material", "Moldagem", "Enviar laboratório"],
  },
  {
    id: "st6",
    name: "Raio-X",
    description: "Exames radiográficos",
    defaultDuration: 15,
    checklistItems: ["Posicionamento", "Tomada radiográfica", "Análise"],
  },
];

export function ApiDataProvider({ children }: { children: ReactNode }) {
  // Services
  const services = useServices();
  const userService = services.userService;
  const patientService = services.patientService;
  const procedureTemplateService = services.procedureTemplateService;
  const procedureTemplateStageService = services.procedureTemplateStageService;
  const treatmentService = services.treatmentService;
  const treatmentStageService = services.treatmentStageService;
  const financialService = services.financialService;

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [procedureTemplates, setProcedureTemplates] = useState<
    ProcedureTemplate[]
  >([]);
  const [procedureTemplateStages, setProcedureTemplateStages] = useState<
    ProcedureTemplateStage[]
  >([]);
  // Stage templates are local-only (backend doesn't provide them).
  // Start empty so the UI doesn't show example stages when the DB is empty.
  // Example templates remain available in `src/data/examples/mockData.json`.
  const [stageTemplates, setStageTemplates] = useState<StageTemplate[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [treatmentStages, setTreatmentStages] = useState<TreatmentStage[]>([]);
  const [financialRecords, setFinancialRecords] = useState<
    ExtendedFinancialRecord[]
  >([]);

  // Load all data from API
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        usersData,
        patientsData,
        templatesData,
        templateStagesData,
        treatmentsData,
        treatmentStagesData,
        financialData,
      ] = await Promise.all([
        userService.getAll().catch(() => []),
        patientService.getAll().catch(() => []),
        procedureTemplateService.getAll().catch(() => []),
        procedureTemplateStageService.getAll().catch(() => []),
        treatmentService.getAll().catch(() => []),
        treatmentStageService.getAll().catch(() => []),
        financialService.getAll().catch(() => []),
      ]);

      setUsers(usersData);
      setPatients(patientsData);
      setProcedureTemplates(templatesData);

      // There are two different concepts in the API:
      // - /api/modelosetapas returns "ModeloEtapa" (stage templates reusable across models)
      // - /api/modelosprocedimentos/{id}/etapas returns "EtapaModeloProcedimento" (stages that belong to a specific procedure template)
      // Frontend needs the latter stored in `procedureTemplateStages` so `getStagesByTemplateId` works.
      // If the generic getAll() returned items that already contain `modeloProcedimentoId`, use them.
      let resolvedProcedureTemplateStages: any[] = templateStagesData as any[];

      const hasModeloProcedimentoId =
        Array.isArray(resolvedProcedureTemplateStages) &&
        resolvedProcedureTemplateStages.length > 0 &&
        "modeloProcedimentoId" in resolvedProcedureTemplateStages[0];

      if (!hasModeloProcedimentoId) {
        // Fallback: fetch stages per template (calls /modelosprocedimentos/{id}/etapas)
        try {
          const perTemplatePromises = (templatesData || []).map((t: any) =>
            procedureTemplateStageService.getByTemplateId(t.id).catch(() => [])
          );

          const perTemplateResults = await Promise.all(perTemplatePromises);
          resolvedProcedureTemplateStages = perTemplateResults.flat();
        } catch (e) {
          // if everything fails, keep the original templateStagesData (might be empty)
          resolvedProcedureTemplateStages = templateStagesData as any[];
        }
      }

      // Diagnostic logs: only in development
      if (import.meta.env.DEV) {
        try {
          try {
            // @ts-ignore
            toast.info(
              `Diagnóstico: Etapas carregadas: ${resolvedProcedureTemplateStages.length}`
            );
          } catch {}
        } catch {}
      }

      setProcedureTemplateStages(
        resolvedProcedureTemplateStages as ProcedureTemplateStage[]
      );
      setTreatments(treatmentsData);
      setTreatmentStages(treatmentStagesData);
      setFinancialRecords(
        financialData.map((r) => ({
          ...r,
          status: (r as any).status || "paid",
          responsibleType: (r as any).responsibleType || "patient",
          createdBy: (r as any).createdBy || "",
        })) as ExtendedFinancialRecord[]
      );
    } catch (error) {
      console.error("Erro ao carregar dados da API:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    userService,
    patientService,
    procedureTemplateService,
    procedureTemplateStageService,
    treatmentService,
    treatmentStageService,
    financialService,
  ]);

  // Initial load
  useEffect(() => {
    // Remove legacy mock-localStorage keys that may have been created
    // by previous runtime mock implementations. This prevents stale
    // mock data (ex: `dentaltrack_stageTemplates`) from showing when
    // the backend is empty.
    try {
      const legacyKeys = [
        "dentaltrack_stageTemplates",
        "dentaltrack_procedureTemplates",
        "dentaltrack_procedureTemplateStages",
        "dentaltrack_treatments",
        "dentaltrack_treatmentStages",
        "dentaltrack_users",
        "dentaltrack_patients",
        "dentaltrack_financialRecords",
      ];
      legacyKeys.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      // If localStorage isn't available (server-side render or strict env), ignore.
    }

    refreshData();
  }, [refreshData]);

  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Users CRUD (fire-and-forget com tratamento de erro)
  const addUser = (user: User) => {
    // Otimista: atualiza local primeiro
    setUsers((prev) => [...prev, user]);
    userService.create(user).catch((error) => {
      console.error("Erro ao criar usuário:", error);
      toast.error("Erro ao criar usuário");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    });
  };
  const updateUser = (id: string, data: Partial<User>) => {
    const oldUser = users.find((u) => u.id === id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    userService.update(id, data).catch((error) => {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário");
      if (oldUser)
        setUsers((prev) => prev.map((u) => (u.id === id ? oldUser : u)));
    });
  };
  const deleteUser = (id: string) => {
    const oldUser = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    userService.delete(id).catch((error) => {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário");
      if (oldUser) setUsers((prev) => [...prev, oldUser]);
    });
  };

  // Patients CRUD
  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient]);
    patientService.create(patient).catch((error) => {
      console.error("Erro ao criar paciente:", error);
      toast.error("Erro ao criar paciente");
      setPatients((prev) => prev.filter((p) => p.id !== patient.id));
    });
  };
  const updatePatient = (id: string, data: Partial<Patient>) => {
    const oldPatient = patients.find((p) => p.id === id);
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    patientService.update(id, data).catch((error) => {
      console.error("Erro ao atualizar paciente:", error);
      toast.error("Erro ao atualizar paciente");
      if (oldPatient)
        setPatients((prev) => prev.map((p) => (p.id === id ? oldPatient : p)));
    });
  };
  const deletePatient = (id: string) => {
    const oldPatient = patients.find((p) => p.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    patientService.delete(id).catch((error) => {
      console.error("Erro ao excluir paciente:", error);
      toast.error("Erro ao excluir paciente");
      if (oldPatient) setPatients((prev) => [...prev, oldPatient]);
    });
  };

  // Procedure Templates CRUD
  const addProcedureTemplate = (template: ProcedureTemplate) => {
    setProcedureTemplates((prev) => [...prev, template]);
    procedureTemplateService.create(template).catch((error) => {
      console.error("Erro ao criar modelo:", error);
      toast.error("Erro ao criar modelo de procedimento");
      setProcedureTemplates((prev) => prev.filter((t) => t.id !== template.id));
    });
  };
  const updateProcedureTemplate = (
    id: string,
    data: Partial<ProcedureTemplate>
  ) => {
    const oldTemplate = procedureTemplates.find((t) => t.id === id);
    setProcedureTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    procedureTemplateService.update(id, data).catch((error) => {
      console.error("Erro ao atualizar modelo:", error);
      toast.error("Erro ao atualizar modelo");
      if (oldTemplate)
        setProcedureTemplates((prev) =>
          prev.map((t) => (t.id === id ? oldTemplate : t))
        );
    });
  };
  const deleteProcedureTemplate = (id: string) => {
    const oldTemplate = procedureTemplates.find((t) => t.id === id);
    const oldStages = procedureTemplateStages.filter(
      (s) => (s as any).modeloProcedimentoId === id
    );
    setProcedureTemplates((prev) => prev.filter((t) => t.id !== id));
    setProcedureTemplateStages((prev) =>
      prev.filter((s) => (s as any).modeloProcedimentoId !== id)
    );
    procedureTemplateService.delete(id).catch((error) => {
      console.error("Erro ao excluir modelo:", error);
      toast.error("Erro ao excluir modelo");
      if (oldTemplate) setProcedureTemplates((prev) => [...prev, oldTemplate]);
      if (oldStages.length)
        setProcedureTemplateStages((prev) => [...prev, ...oldStages]);
    });
  };

  // Procedure Template Stages CRUD
  const addProcedureTemplateStage = (stage: ProcedureTemplateStage) => {
    setProcedureTemplateStages((prev) => [...prev, stage]);
    procedureTemplateStageService.create(stage).catch((error) => {
      console.error("Erro ao criar etapa:", error);
      toast.error("Erro ao criar etapa de procedimento");
      setProcedureTemplateStages((prev) =>
        prev.filter((s) => s.id !== stage.id)
      );
    });
  };
  const updateProcedureTemplateStage = (
    id: string,
    data: Partial<ProcedureTemplateStage>
  ) => {
    const oldStage = procedureTemplateStages.find((s) => s.id === id);
    setProcedureTemplateStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
    procedureTemplateStageService.update(id, data).catch((error) => {
      console.error("Erro ao atualizar etapa:", error);
      toast.error("Erro ao atualizar etapa");
      if (oldStage)
        setProcedureTemplateStages((prev) =>
          prev.map((s) => (s.id === id ? oldStage : s))
        );
    });
  };
  const deleteProcedureTemplateStage = (id: string) => {
    const oldStage = procedureTemplateStages.find((s) => s.id === id);
    setProcedureTemplateStages((prev) => prev.filter((s) => s.id !== id));
    procedureTemplateStageService.delete(id).catch((error) => {
      console.error("Erro ao excluir etapa:", error);
      toast.error("Erro ao excluir etapa");
      if (oldStage) setProcedureTemplateStages((prev) => [...prev, oldStage]);
    });
  };
  const swapProcedureTemplateStageOrder = (
    stageId1: string,
    stageId2: string
  ) => {
    setProcedureTemplateStages((prev) => {
      const stage1 = prev.find((s) => s.id === stageId1) as any;
      const stage2 = prev.find((s) => s.id === stageId2) as any;
      if (!stage1 || !stage2) return prev;
      const ordem1 = stage1.ordemExibicao;
      const ordem2 = stage2.ordemExibicao;
      return prev.map((s) => {
        if (s.id === stageId1) return { ...s, ordemExibicao: ordem2 } as any;
        if (s.id === stageId2) return { ...s, ordemExibicao: ordem1 } as any;
        return s;
      });
    });
  };

  // Stage Templates CRUD (local only)
  const addStageTemplate = (template: StageTemplate) =>
    setStageTemplates((prev) => [...prev, template]);
  const updateStageTemplate = (id: string, data: Partial<StageTemplate>) =>
    setStageTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  const deleteStageTemplate = (id: string) =>
    setStageTemplates((prev) => prev.filter((t) => t.id !== id));

  // Treatments CRUD
  const addTreatment = (treatment: Treatment) => {
    setTreatments((prev) => [...prev, treatment]);
    treatmentService.create(treatment).catch((error) => {
      console.error("Erro ao criar atendimento:", error);
      toast.error("Erro ao criar atendimento");
      setTreatments((prev) => prev.filter((t) => t.id !== treatment.id));
    });
  };
  const updateTreatment = (id: string, data: Partial<Treatment>) => {
    const oldTreatment = treatments.find((t) => t.id === id);
    setTreatments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    treatmentService.update(id, data).catch((error) => {
      console.error("Erro ao atualizar atendimento:", error);
      toast.error("Erro ao atualizar atendimento");
      if (oldTreatment)
        setTreatments((prev) =>
          prev.map((t) => (t.id === id ? oldTreatment : t))
        );
    });
  };
  const deleteTreatment = (id: string) => {
    const oldTreatment = treatments.find((t) => t.id === id);
    // treatmentStages store atendimentoId (Portuguese) after migration
    const oldStages = treatmentStages.filter(
      (s) => (s as any).atendimentoId === id
    );
    setTreatments((prev) => prev.filter((t) => t.id !== id));
    setTreatmentStages((prev) =>
      prev.filter((s) => (s as any).atendimentoId !== id)
    );
    treatmentService.delete(id).catch((error) => {
      console.error("Erro ao excluir atendimento:", error);
      toast.error("Erro ao excluir atendimento");
      if (oldTreatment) setTreatments((prev) => [...prev, oldTreatment]);
      if (oldStages.length)
        setTreatmentStages((prev) => [...prev, ...oldStages]);
    });
  };

  // Treatment Stages CRUD
  const addTreatmentStage = (stage: TreatmentStage) => {
    setTreatmentStages((prev) => [...prev, stage]);
    treatmentStageService.create(stage).catch((error) => {
      console.error("Erro ao criar etapa de atendimento:", error);
      toast.error("Erro ao criar etapa de atendimento");
      setTreatmentStages((prev) => prev.filter((s) => s.id !== stage.id));
    });
  };
  const updateTreatmentStage = (id: string, data: Partial<TreatmentStage>) => {
    const oldStage = treatmentStages.find((s) => s.id === id);
    setTreatmentStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
    treatmentStageService.update(id, data).catch((error) => {
      console.error("Erro ao atualizar etapa de atendimento:", error);
      toast.error("Erro ao atualizar etapa de atendimento");
      if (oldStage)
        setTreatmentStages((prev) =>
          prev.map((s) => (s.id === id ? oldStage : s))
        );
    });
  };
  const deleteTreatmentStage = (id: string) => {
    const oldStage = treatmentStages.find((s) => s.id === id);
    setTreatmentStages((prev) => prev.filter((s) => s.id !== id));
    treatmentStageService.delete(id).catch((error) => {
      console.error("Erro ao excluir etapa de atendimento:", error);
      toast.error("Erro ao excluir etapa de atendimento");
      if (oldStage) setTreatmentStages((prev) => [...prev, oldStage]);
    });
  };

  // Financial Records CRUD
  const addFinancialRecord = (record: ExtendedFinancialRecord) => {
    setFinancialRecords((prev) => [...prev, record]);
    financialService.create(record).catch((error) => {
      console.error("Erro ao criar lançamento financeiro:", error);
      toast.error("Erro ao criar lançamento financeiro");
      setFinancialRecords((prev) => prev.filter((r) => r.id !== record.id));
    });
  };
  const updateFinancialRecord = (
    id: string,
    data: Partial<ExtendedFinancialRecord>
  ) => {
    const oldRecord = financialRecords.find((r) => r.id === id);
    setFinancialRecords((prev) =>
      prev.map((r) =>
        r.id === id ? ({ ...r, ...data } as ExtendedFinancialRecord) : r
      )
    );
    financialService.update(id, data).catch((error) => {
      console.error("Erro ao atualizar lançamento financeiro:", error);
      toast.error("Erro ao atualizar lançamento financeiro");
      if (oldRecord)
        setFinancialRecords((prev) =>
          prev.map((r) => (r.id === id ? oldRecord : r))
        );
    });
  };
  const deleteFinancialRecord = (id: string) => {
    const oldRecord = financialRecords.find((r) => r.id === id);
    setFinancialRecords((prev) => prev.filter((r) => r.id !== id));
    financialService.delete(id).catch((error) => {
      console.error("Erro ao excluir lançamento financeiro:", error);
      toast.error("Erro ao excluir lançamento financeiro");
      if (oldRecord) setFinancialRecords((prev) => [...prev, oldRecord]);
    });
  };

  // Helper functions
  const getPatientById = (id: string) => patients.find((p) => p.id === id);
  const getTemplateById = (id: string) =>
    procedureTemplates.find((t) => t.id === id);
  const getUserById = (id: string) => users.find((u) => u.id === id);
  const getStagesByTemplateId = (modeloProcedimentoId: string) =>
    procedureTemplateStages
      .filter((s: any) => s.modeloProcedimentoId === modeloProcedimentoId)
      .sort(
        (a: any, b: any) => (a.ordemExibicao || 0) - (b.ordemExibicao || 0)
      );
  const getStagesByTreatmentId = (treatmentId: string) =>
    treatmentStages
      .filter((s: any) => s.atendimentoId === treatmentId)
      .sort(
        (a: any, b: any) => (a.ordemExibicao || 0) - (b.ordemExibicao || 0)
      );
  const getTreatmentsByPatientId = (patientId: string) =>
    treatments.filter((t) => (t as any).pacienteId === patientId);
  const getFinancialByTreatmentId = (treatmentId: string) =>
    financialRecords.filter((f: any) => f.atendimentoId === treatmentId);

  const resetAllData = () => {
    refreshData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider
      value={{
        isLoading,
        users,
        addUser,
        updateUser,
        deleteUser,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        procedureTemplates,
        addProcedureTemplate,
        updateProcedureTemplate,
        deleteProcedureTemplate,
        procedureTemplateStages,
        addProcedureTemplateStage,
        updateProcedureTemplateStage,
        deleteProcedureTemplateStage,
        swapProcedureTemplateStageOrder,
        stageTemplates,
        addStageTemplate,
        updateStageTemplate,
        deleteStageTemplate,
        treatments,
        addTreatment,
        updateTreatment,
        deleteTreatment,
        treatmentStages,
        addTreatmentStage,
        updateTreatmentStage,
        deleteTreatmentStage,
        financialRecords,
        addFinancialRecord,
        updateFinancialRecord,
        deleteFinancialRecord,
        getPatientById,
        getTemplateById,
        getUserById,
        getStagesByTemplateId,
        getStagesByTreatmentId,
        getTreatmentsByPatientId,
        getFinancialByTreatmentId,
        generateId,
        refreshData,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useApiData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useApiData must be used within an ApiDataProvider");
  }
  return context;
}
