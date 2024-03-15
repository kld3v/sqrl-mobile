import { ApiResponse } from "apisauce"
import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import { DocumentResponseObject, DocumentsToSignResponseObject } from "./TermsService.types"
import { api } from "../api"

export class TermsService {
  async checkUserAgreements(): Promise<DocumentResponseObject[] | false | Error> {
    let res: ApiResponse<DocumentsToSignResponseObject>
    try {
      let device_uuid = await secureStoreInstance.getDeviceUUID()
      res = await api.apisauce.get("/agreements/check", {
        device_uuid,
      })
    } catch (error) {
      // Needs to handle error so that user cannot use app without signing t/c's.
      console.error("Error checking user agreements API Request", error)
      return new Error("Error checking user agreements API Request")
    }

    if (!res.data) return false

    if (!res.data.documents_to_sign) return false

    return res.data.documents_to_sign
  }

  async signUserAgreements(signedDocIds: number[]): Promise<boolean> {
    try {
      let res = await api.apisauce.post("/agreements/sign", {
        device_uuid: await secureStoreInstance.getDeviceUUID(),
        document_version_ids: signedDocIds,
      })
      return res && res.ok ? true : false
    } catch (error) {
      console.error("Error signing user agreements API Request", error)
      return false
    }
  }
}

export const termsService = new TermsService()
