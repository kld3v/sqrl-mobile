import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import { DocumentResponseObject, DocumentsToSignResponseObject } from "./TermsService.types"
import { DEFAULT_API_CONFIG } from "../api"

export class TermsService {
  apisauce: ApisauceInstance

  constructor() {
    this.apisauce = create({
      baseURL: DEFAULT_API_CONFIG.url,
      timeout: DEFAULT_API_CONFIG.timeout,
      headers: DEFAULT_API_CONFIG.headers,
    })
  }

  async checkUserAgreements(): Promise<DocumentResponseObject[] | false | Error> {
    let res: ApiResponse<DocumentsToSignResponseObject>
    try {
      let device_uuid = await secureStoreInstance.getDeviceUUID()
      res = await this.apisauce.get("/agreements/check", {
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

  async signUserAgreements(signedDocIds: number[]): Promise<void> {
    try {
      await this.apisauce.post("/agreements/sign", {
        device_uuid: await secureStoreInstance.getDeviceUUID(),
        document_version_ids: signedDocIds,
      })
    } catch (error) {
      console.error("Error signing user agreements API Request", error)
    }
  }
}

export const termsService = new TermsService()
