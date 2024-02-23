import { ApisauceConfig, ApisauceInstance, create } from "apisauce"
import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import { TermsServiceConfig } from "./TermsService.types"
import configProd from "app/config/config.prod"
import { DEFAULT_API_CONFIG } from "../api"

export class TermsService {
  // config: TermsServiceConfig
  apisauce: ApisauceInstance

  constructor() {
    this.apisauce = create({
      baseURL: DEFAULT_API_CONFIG.url,
      timeout: DEFAULT_API_CONFIG.timeout,
      headers: DEFAULT_API_CONFIG.headers,
    })
  }

  async getSignedTermsVersion() {
    secureStoreInstance.getValueFromSecureStore()
  }

  async checkIfUserHasSignedUpToDateContract() {}
}
