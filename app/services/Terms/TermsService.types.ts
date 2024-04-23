export type DocumentResponseObject = { id: number; document_name: string; document_url: string }

export interface DocumentsToSignResponseObject {
  documents_to_sign: null | DocumentResponseObject[]
}
