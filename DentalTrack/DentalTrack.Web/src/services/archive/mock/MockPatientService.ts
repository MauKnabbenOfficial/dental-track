import { Patient, patients as initialPatients } from "@/data/mockData";
import {
  IPatientService,
  PatientFilterOptions,
} from "../interfaces/IPatientService";
import { PaginatedResult } from "../interfaces/IBaseService";
import {
  MockStorage,
  simulateDelay,
  filterByText,
  sortBy,
  paginate,
} from "./mockUtils";

// Archived mock patient service for reference only.
export {};
