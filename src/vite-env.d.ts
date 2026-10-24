/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL del backend, p. ej. http://localhost:8080 o https://api.prudencio.mx. Vacía = mismo origen. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
