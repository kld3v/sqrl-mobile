import { api } from "../api"
import { Scan } from "./HistoryService.types"

export class HistoryService {
  async getHistory(): Promise<Scan[] | false> {
    try {
      let res = await api.apisauce.get("/scans/history")
      if (res.ok) return res.data as Scan[]
    } catch (error) {
      console.log(error)
      return false
    }
    return false
  }

  async addToFavorite(url_id: number): Promise<boolean> {
    try {
      let res = await api.apisauce.post("/favorites", {
        url_id,
      })
      switch (res.status) {
        case 200:
          return true
        case 401:
          console.log("User is not authenticated")
          return false
        case 404:
          console.log("Specified URL or URL ID does not exist")
          return false
        case 409:
          console.log("The URL is already in the user's favorites")
          return false
        case 422:
          console.log("Neither URL nor URL ID was provided")
          return false
        default:
          console.log("Error adding to favorite")
          return false
      }
    } catch (error) {
      console.log(error)
      console.log("Error occured during /favorites post request")
      return false
    }
  }

  async deleteFavorite(url_id: number) {
    try {
      let res = await api.apisauce.delete("/favorites", {
        url_id,
      })
      switch (res.status) {
        case 200:
          return true
        case 401:
          console.log("User is not authenticated")
          return false
        case 404:
          console.log("Specified URL or URL ID does not exist")
          return false
        case 409:
          console.log("The URL is already in the user's favorites")
          return false
        case 422:
          console.log("Neither URL nor URL ID was provided")
          return false
        default:
          console.log("Error adding to favorite")
          return false
      }
    } catch (error) {
      console.log(error)
      console.log("Error occured during /favorites delete request")
      return false
    }
  }
}

export const historyService = new HistoryService()
