import { ApisauceInstance, create } from "apisauce"
import { LocationObject } from "expo-location"
import * as Location from "expo-location"
import { QrVenueNotificationsConfig } from "./QrVenueNotificationService.types"

export class QrVenueNotificationService {
  location: LocationObject | null = null
  apisauce: ApisauceInstance
  config: QrVenueNotificationsConfig

  constructor() {
    this.config = {
      baseURL: "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/venues/location",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    }
    this.apisauce = create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })
  }

  async getLocation(): Promise<LocationObject | null> {
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    })
    return location
  }

  async setLocation(): Promise<void> {
    this.location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    })
  }

  async seeIfUserLocationMatchesQrVenueGeoFence(): Promise<false | { url: string }> {
    if (this.location === null) {
      try {
        await this.setLocation()
        console.info("Location set in QrVenueNotificationService", this.location)
      } catch (error) {
        console.error(`Error getting location in QrVenueNotificationService:  ${error}`)
        return false
      }
    }

    if (this.location) {
      const { latitude, longitude } = this.location?.coords

      const response = await this.apisauce.get("", { latitude, longitude })

      console.log(response.data[0].url.url, "response")

      if (response.ok) {
        console.info("User is within the geo-fence of a venue", response.data[0])

        //@ts-ignore
        return { url: response.data[0].url.url }
      } else {
        console.error(
          `Failed at get request to API -> ${response.data.message}, ${response.problem}`,
        )
        return false
      }
    }
    return false
  }
}

export const qrVenueNotificationService = new QrVenueNotificationService()
