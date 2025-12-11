/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Se 'true', usa implementação Mock (localStorage).
   * Se 'false', usa implementação API real.
   */
  readonly VITE_USE_MOCK: string;

  /**
   * URL base da API
   */
  readonly VITE_API_URL: string;

  /**
   * Timeout das requisições HTTP em milissegundos
   */
  readonly VITE_API_TIMEOUT: string;

  /**
   * Ambiente: development, staging, production
   */
  readonly VITE_APP_ENV: "development" | "staging" | "production";

  /**
   * Título da aplicação
   */
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
