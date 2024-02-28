export type DocumentResponseObject = { id: number; term_name: string; term_url: string }

export interface DocumentsToSignResponseObject {
  documents_to_sign: null | DocumentResponseObject[]
}
