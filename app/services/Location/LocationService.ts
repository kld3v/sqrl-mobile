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
<<<<<<< HEAD
    let currentPosition = await Location.getCurrentPositionAsync()
    console.log("currentPosition", currentPosition)
    return currentPosition
=======
    return await Location.getCurrentPositionAsync()
>>>>>>> e1d1f2f01f095e92a707aca4851c9ea1cd679ba8
  }
}

export const locationService = new LocationService()
