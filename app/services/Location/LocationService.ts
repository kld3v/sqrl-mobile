import * as Location from "expo-location"

export class LocationService {
  permission: Location.PermissionResponse
  constructor() {
    this.permission = {
      status: Location.PermissionStatus.UNDETERMINED,
      expires: "never",
      granted: false,
      canAskAgain: true,
    }
  }

  async requestPermission() {
    this.permission = await Location.requestForegroundPermissionsAsync()
  }

  async getCurrentPosition(distance?: number): Promise<Location.LocationObject> {
    let currentPosition = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: distance || 0,
    })
    // console.log("currentPosition", currentPosition)
    return currentPosition
  }

  async getLastKnownPosition(): Promise<Location.LocationObject | null> {
    let lastKnownPosition = await Location.getLastKnownPositionAsync()
    // console.log("lastKnownPosition", lastKnownPosition)
    return lastKnownPosition
  }

  // Need to revisit this
  // activateLocationWatch = (): Promise<Location.LocationObject> => {
  //   return new Promise((resolve, reject) => {
  //     Location.watchPositionAsync(
  //       {
  //         accuracy: Location.Accuracy.BestForNavigation,
  //         distanceInterval: 10,
  //       },
  //       (location) => {
  //         resolve(location)
  //       },
  //     ).catch((error) => {
  //       reject(error)
  //     })
  //   })
  // }
}

export const locationService = new LocationService()
