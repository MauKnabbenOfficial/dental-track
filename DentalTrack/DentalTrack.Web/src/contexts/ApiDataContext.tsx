import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import { useServices } from "@/services";
import { TipoResponsavel, StatusLancamento } from "@/types/backendEnums";
import {
  UsuarioDto,
  PacienteDto,
  AtendimentoDto,
  EtapaAtendimentoDto,
  LancamentoFinanceiroDto,
  User,
  Patient,
  Treatment,
  TreatmentStage,
  FinancialRecord,
  ProcedureTemplate,
  ProcedureTemplateStage,
} from "@/types/backendDtos";

// Extended FinancialRecord with new fields
export interface ExtendedFinancialRecord extends FinancialRecord {}

// Stage Template for reusable stages
export interface StageTemplate {
  id: string;
  nome: string;
  descricao: string;
  duracaoPadraoMinutos: number;
  itensChecklist: string[];
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
  addProcedureTemplateStage: (
    stage: ProcedureTemplateStage
  ) => Promise<ProcedureTemplateStage>;
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
    nome: "Anestesia",
    descricao: "Aplicação de anestesia local",
    duracaoPadraoMinutos: 15,
    itensChecklist: [
      "Verificar alergias",
      "Preparar material",
      "Aplicar anestésico",
    ],
  },
  {
    id: "st2",
    nome: "Consulta Inicial",
    descricao: "Primeira avaliação do paciente",
    duracaoPadraoMinutos: 30,
    itensChecklist: ["Anamnese", "Exame clínico", "Radiografias iniciais"],
  },
  {
    id: "st3",
    nome: "Cirurgia",
    descricao: "Procedimento cirúrgico",
    duracaoPadraoMinutos: 90,
    itensChecklist: [
      "Checklist pré-operatório",
      "Equipamentos",
      "Pós-operatório",
    ],
  },
  {
    id: "st4",
    nome: "Retorno",
    descricao: "Consulta de acompanhamento",
    duracaoPadraoMinutos: 20,
    itensChecklist: ["Avaliação cicatrização", "Orientações"],
  },
  {
    id: "st5",
    nome: "Moldagem",
    descricao: "Tomada de moldes",
    duracaoPadraoMinutos: 30,
    itensChecklist: ["Preparar material", "Moldagem", "Enviar laboratório"],
  },
  {
    id: "st6",
    nome: "Raio-X",
    descricao: "Exames radiográficos",
    duracaoPadraoMinutos: 15,
    itensChecklist: ["Posicionamento", "Tomada radiográfica", "Análise"],
  },
];

export function ApiDataProvider({ children }: { children: ReactNode }) {
  // Services
  const services = useServices();
  const userService = services.userService;
  const patientService = services.patientService;
  const procedureTemplateService = services.procedureTemplateService;
  const procedureTemplateStageService = services.procedureTemplateStageService;
  const stageTemplateService = services.stageTemplateService;
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
        stageTemplatesData,
        treatmentsData,
        treatmentStagesData,
        financialData,
      ] = await Promise.all([
        userService.getAll().catch(() => []),
        patientService.getAll().catch(() => []),
        procedureTemplateService.getAll().catch(() => []),
        procedureTemplateStageService.getAll().catch(() => []),
        stageTemplateService.getAll().catch(() => []),
        treatmentService.getAll().catch(() => []),
        treatmentStageService.getAll().catch(() => []),
        financialService.getAll().catch(() => []),
      ]);

      // Adicionar logs para depuração
      console.log("Templates Data:", templatesData);
      console.log("Template Stages Data:", templateStagesData);

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
        ("ModeloProcedimentoId" in resolvedProcedureTemplateStages[0] ||
          "modeloProcedimentoId" in resolvedProcedureTemplateStages[0]);

      if (!hasModeloProcedimentoId) {
        // Fallback: fetch stages per template (calls /modelosprocedimentos/{id}/etapas)
        try {
          const perTemplatePromises = (templatesData || []).map((t: any) =>
            procedureTemplateStageService.getByTemplateId(t.id).catch(() => [])
          );

          const perTemplateResults = await Promise.all(perTemplatePromises);

          // Adicionar logs para depuração
          console.log("Resultados por modelo:", perTemplateResults);

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
      // set stage templates (these are reusable step templates)
      setStageTemplates(stageTemplatesData as any[]);
      // Do not normalize API shapes here — keep backend property names intact.
      setTreatments(treatmentsData as any[]);

      // The API does not provide a global "get all stages" endpoint —
      // `treatmentStageService.getAll()` is a noop for the real API and
      // returns an empty array. To ensure the frontend has the stages
      // for each atendimento, if `treatmentStagesData` is empty, fetch
      // stages per treatment using `/atendimentos/{id}/etapas`.
      let resolvedTreatmentStages: any[] = treatmentStagesData as any[];
      if (
        (!Array.isArray(resolvedTreatmentStages) ||
          resolvedTreatmentStages.length === 0) &&
        Array.isArray(treatmentsData) &&
        treatmentsData.length > 0
      ) {
        try {
          const perTreatmentPromises = (treatmentsData || []).map((t: any) =>
            treatmentStageService.getByTreatmentId(t.id).catch(() => [])
          );
          const perTreatmentResults = await Promise.all(perTreatmentPromises);
          resolvedTreatmentStages = perTreatmentResults.flat();
        } catch (e) {
          // fallback to whatever was returned initially (possibly empty)
          resolvedTreatmentStages = treatmentStagesData as any[];
        }
      }

      setTreatmentStages(resolvedTreatmentStages as TreatmentStage[]);
      // Ensure financialRecords are normalized to camelCase
      setFinancialRecords(
        financialData.map((record) => ({
          id: record.id || record.Id,
          value: record.valor || record.Valor,
          status: record.status || record.Status,
          responsibleType: record.responsibleType || record.ResponsibleType,
          paymentDate: record.paymentDate || record.PaymentDate,
          createdBy: record.createdBy || record.CreatedBy,
          ...record,
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
      (s) =>
        (s as any).ModeloProcedimentoId === id ||
        (s as any).modeloProcedimentoId === id
    );
    setProcedureTemplates((prev) => prev.filter((t) => t.id !== id));
    setProcedureTemplateStages((prev) =>
      prev.filter(
        (s) =>
          (s as any).ModeloProcedimentoId !== id &&
          (s as any).modeloProcedimentoId !== id
      )
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
  const addProcedureTemplateStage = (
    stage: ProcedureTemplateStage
  ): Promise<ProcedureTemplateStage> => {
    // Otimista: adiciona a etapa temporária e em seguida chama o backend.
    setProcedureTemplateStages((prev) => [...prev, stage]);

    return procedureTemplateStageService
      .create(stage)
      .then((created) => {
        // Substitui a etapa temporária (id gerado no cliente) pela versão retornada pelo servidor
        setProcedureTemplateStages((prev) =>
          prev.map((s) => (s.id === stage.id ? created : s))
        );
        return created;
      })
      .catch((error) => {
        console.error("Erro ao criar etapa:", error);
        toast.error("Erro ao criar etapa de procedimento");
        // Remove a etapa temporária caso a criação falhe
        setProcedureTemplateStages((prev) =>
          prev.filter((s) => s.id !== stage.id)
        );
        throw error;
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
    const modeloProcedimentoId =
      (oldStage as any)?.ModeloProcedimentoId ??
      (oldStage as any)?.modeloProcedimentoId;
    procedureTemplateStageService
      .update(id, data, modeloProcedimentoId)
      .catch((error) => {
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
    const modeloProcedimentoId =
      (oldStage as any)?.ModeloProcedimentoId ??
      (oldStage as any)?.modeloProcedimentoId;
    procedureTemplateStageService
      .delete(id, modeloProcedimentoId)
      .catch((error) => {
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
      const ordem1 = stage1.OrdemExibicao ?? stage1.ordemExibicao;
      const ordem2 = stage2.OrdemExibicao ?? stage2.ordemExibicao;
      return prev.map((s) => {
        if (s.id === stageId1)
          return { ...s, OrdemExibicao: ordem2, ordemExibicao: ordem2 } as any;
        if (s.id === stageId2)
          return { ...s, OrdemExibicao: ordem1, ordemExibicao: ordem1 } as any;
        return s;
      });
    });
  };

  // Stage Templates CRUD (local only)
  const addStageTemplate = (template: StageTemplate) => {
    // Send creation to backend and use server-generated ID.
    stageTemplateService
      .create({
        Nome: template.nome,
        Descricao: template.descricao,
        DuracaoPadraoMinutos: template.duracaoPadraoMinutos,
        ItensChecklist: template.itensChecklist,
      })
      .then((created) => {
        // Add the created item returned by the server (contains real id)
        setStageTemplates((prev) => [...prev, created]);
      })
      .catch((error) => {
        console.error("Erro ao criar modelo de etapa:", error);
        toast.error("Erro ao criar modelo de etapa");
      });
  };

  const updateStageTemplate = (id: string, data: Partial<StageTemplate>) => {
    const old = stageTemplates.find((s) => s.id === id);
    setStageTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    stageTemplateService.update(id, data).catch((error) => {
      console.error("Erro ao atualizar modelo de etapa:", error);
      toast.error("Erro ao atualizar modelo de etapa");
      if (old)
        setStageTemplates((prev) => prev.map((t) => (t.id === id ? old : t)));
    });
  };

  const deleteStageTemplate = (id: string) => {
    const old = stageTemplates.find((s) => s.id === id);
    setStageTemplates((prev) => prev.filter((t) => t.id !== id));
    stageTemplateService.delete(id).catch((error) => {
      console.error("Erro ao excluir modelo de etapa:", error);
      toast.error("Erro ao excluir modelo de etapa");
      if (old) setStageTemplates((prev) => [...prev, old]);
    });
  };

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
    // Send stage to server (do not rely on client-generated id).
    treatmentStageService
      .create(stage)
      .then((created) => {
        setTreatmentStages((prev) => [...prev, created]);
      })
      .catch((error) => {
        console.error("Erro ao criar etapa de atendimento:", error);
        toast.error("Erro ao criar etapa de atendimento");
      });
  };
  const updateTreatmentStage = (id: string, data: Partial<TreatmentStage>) => {
    const oldStage = treatmentStages.find((s) => s.id === id);
    setTreatmentStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
    // If we have the atendimentoId locally, pass it to the API service
    const atendimentoId =
      (oldStage as any)?.atendimentoId ?? (oldStage as any)?.treatmentId;
    treatmentStageService.update(id, data, atendimentoId).catch((error) => {
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
    const atendimentoId =
      (oldStage as any)?.atendimentoId ?? (oldStage as any)?.treatmentId;
    treatmentStageService.delete(id, atendimentoId).catch((error) => {
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
  const getStagesByTemplateId = (modeloProcedimentoId: string) => {
    const filteredStages = procedureTemplateStages
      .filter(
        (s: any) =>
          (s.ModeloProcedimentoId &&
            s.ModeloProcedimentoId === modeloProcedimentoId) ||
          s.modeloProcedimentoId === modeloProcedimentoId
      )
      .sort(
        (a: any, b: any) =>
          (a.OrdemExibicao ?? a.ordemExibicao ?? 0) -
          (b.OrdemExibicao ?? b.ordemExibicao ?? 0)
      );

    // Adicionar log para depuração
    console.log(
      `Etapas filtradas para ${modeloProcedimentoId}:`,
      filteredStages
    );

    return filteredStages;
  };
  const getStagesByTreatmentId = (treatmentId: string) =>
    treatmentStages
      .filter((s: any) => s.atendimentoId === treatmentId)
      .sort(
        (a: any, b: any) =>
          (a.OrdemExibicao ?? a.ordemExibicao ?? 0) -
          (b.OrdemExibicao ?? b.ordemExibicao ?? 0)
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
