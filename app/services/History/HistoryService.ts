import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import { api } from "../api"
import { Scan } from "./HistoryService.types"

export class HistoryService {
  async getHistory(): Promise<Scan[] | false> {
    try {
      let res = await api.apisauce.get("/scan-history", {
        device_uuid: secureStoreInstance.device_uuid,
      })
      if (res.ok) return res.data as Scan[]
    } catch (error) {
      console.log(error)
      return false
    }
    return false
  }

  async getTestHistory(): Promise<Scan[] | false> {
    try {
      let res = await api.apisauce.get("/scan-history", {
        device_uuid: "a2bed5c7-f080-4189-9c3a-08d7025e0f26",
      })
      if (res.ok) return res.data as Scan[]
    } catch (error) {
      console.log(error)
      return false
    }
    return false
  }
}

export const historyService = new HistoryService()
