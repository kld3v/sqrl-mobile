import { ApisauceInstance, create } from "apisauce"
import { secureStoreInstance } from "../SecureStore/SecureStorageService"

export default class UserFeedbackService {
  private apisauce: ApisauceInstance
  private config: any
  constructor() {
    this.config = {
      url: "https://example.com",
      timeout: 10000,
    }
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    })
  }
  public async sendFeedback(questionID: number, responseAnswer?: string, responseText?: string) {
    const response = await this.apisauce.post("/feedback", {
      questionID,
      device_uuid: secureStoreInstance.getDeviceUUID(),
      responseAnswer,
      responseText,
    })
    return response
  }
}

export const userFeedbackService = new UserFeedbackService()
