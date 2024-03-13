import { ApiResponse } from "apisauce"
import { LocationObject } from "expo-location"
import * as Location from "expo-location"
import { QrVenueNotificationApiResponse } from "./QrVenueNotificationService.types"
import { api } from "../api"

export class QrVenueNotificationService {
  currentLocation: LocationObject | null = null

  get location(): LocationObject | null {
    return this.currentLocation
  }

  async setCurrentLocation(): Promise<void> {
    this.currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    })
  }

  async getCompanyAndUrlOfMatchedQrVenue(
    latitude: number,
    longitude: number,
  ): Promise<false | { url: string; company: string }> {
    const response: ApiResponse<
      QrVenueNotificationApiResponse[],
      QrVenueNotificationApiResponse[]
    > = await api.apisauce.get("/venues/location", { latitude, longitude })

    if (response.data && response.status === 200 && response.data.length > 0) {
      __DEV__ &&
        console.log(`Response from /location Qr Venue API ----> ${response.data[0].url.url}`)

      return { url: response.data[0].url.url, company: response.data[0].company }
    } else {
      console.log(
        `No QrVenue match to user coordinates of lon: ${longitude}, lat: ${latitude} -> res.data: ${response.data}, res.problem: ${response.problem}`,
      )
      return false
    }
  }
}

export const qrVenueNotificationService = new QrVenueNotificationService()
