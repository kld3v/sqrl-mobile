import { ApisauceInstance, create } from "apisauce"
import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import { ApiConfig, DEFAULT_API_CONFIG } from "../api"
export default class UserFeedbackService {
  private apisauce: ApisauceInstance
  private config: any
  constructor() {
    this.config = {
      baseUrl: DEFAULT_API_CONFIG.url,
      timeout: 10000,
    }
    this.apisauce = create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      //TODO DRY CLEANUP
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    })
  }
  public async sendFeedback(questionID: number, responseAnswer?: string, responseText?: string) {
    const response = await this.apisauce.post("/question-responses", {
      questionID,
      device_uuid: secureStoreInstance.getDeviceUUID(),
      responseAnswer,
      responseText,
    })
    return response
  }
}

export const userFeedbackService = new UserFeedbackService()
