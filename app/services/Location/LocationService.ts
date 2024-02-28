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
    return currentPosition
  }

  async getLastKnownPosition(): Promise<Location.LocationObject | null> {
    let lastKnownPosition = await Location.getLastKnownPositionAsync()
    return lastKnownPosition
  }
}

export const locationService = new LocationService()
