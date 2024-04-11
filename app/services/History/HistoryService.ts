import { api } from "../api"
import { Scan } from "./HistoryService.types"

export class HistoryService {
  async getHistory(): Promise<Scan[] | false> {
    try {
      let res = await api.apisauce.get("/scan-history")
      if (res.ok) return res.data as Scan[]
    } catch (error) {
      console.log(error)
      return false
    }
    return false
  }
}

export const historyService = new HistoryService()
