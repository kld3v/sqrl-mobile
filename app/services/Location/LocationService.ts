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
  async getCurrentPosition(): Promise<Location.LocationObject> {
    let currentPosition = await Location.getCurrentPositionAsync()
    console.log("currentPosition", currentPosition)
    return currentPosition
  }
}

export const locationService = new LocationService()
