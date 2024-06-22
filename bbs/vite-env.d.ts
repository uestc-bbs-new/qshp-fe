/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RELEASE_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
