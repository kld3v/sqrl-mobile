import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { LocationObject } from "expo-location"
import * as Location from "expo-location"
import {
  QrVenueNotificationApiResponse,
  QrVenueNotificationsConfig,
} from "./QrVenueNotificationService.types"

export class QrVenueNotificationService {
  currentLocation: LocationObject | null = null
  apisauce_locationEndPoint: ApisauceInstance
  apisauce_nearbyEndPoint: ApisauceInstance
  config: QrVenueNotificationsConfig

  constructor() {
    this.config = {
      baseUrl_locationEndPoint:
        "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/venues/location",
      baseUrl_nearbyEndPoint:
        "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/venues/nearby",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    }
    this.apisauce_locationEndPoint = create({
      baseURL: this.config.baseUrl_locationEndPoint,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })
    this.apisauce_nearbyEndPoint = create({
      baseURL: this.config.baseUrl_nearbyEndPoint,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })
  }

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
    > = await this.apisauce_locationEndPoint.get("", { latitude, longitude })

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
