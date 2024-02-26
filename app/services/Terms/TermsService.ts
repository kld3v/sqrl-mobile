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
      res = await this.apisauce.get("agreements/check", {
        uuid: await secureStoreInstance.getDeviceUUID(),
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
    await this.apisauce.post("agreements/sign", {
      uuid: await secureStoreInstance.getDeviceUUID(),
      doc_id: signedDocIds,
    })
  }
}

export const termsService = new TermsService()
