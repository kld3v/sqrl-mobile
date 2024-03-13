import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import { api } from "../api"
export default class UserFeedbackService {
  public async sendFeedback(questionID: number, responseAnswer?: string, responseText?: string) {
    let device_uuid = await secureStoreInstance.getDeviceUUID()
    // TODO: TYPING @kolyad3v
    const response = await api.apisauce.post("/question-responses", {
      questionID,
      device_uuid,
      responseAnswer,
      responseText,
    })
    return response
  }
}

export const userFeedbackService = new UserFeedbackService()
