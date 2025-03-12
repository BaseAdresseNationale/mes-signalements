export type APIDepotRevision = {
  id: string
  codeCommune: string
  client: {
    id: string
    nom: string
    mandataire: string
  }
  status: string
  isReady: any
  validation: {
    valid: boolean
    validatorVersion: string
    errors: any[]
    warnings: any[]
    infos: any[]
    rowsCount: number
  } | null
  context: {
    extras: any
  }
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  isCurrent: boolean
  habilitation: {
    id: string
    codeCommune: string
    emailCommune: string
    strategy: any
    createdAt: string
    updatedAt: string
    expiresAt: string
  } | null
}
