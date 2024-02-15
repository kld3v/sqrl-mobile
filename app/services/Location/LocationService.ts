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
    return await Location.getCurrentPositionAsync()
  }
}

export const locationService = new LocationService()
