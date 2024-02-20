import * as SecureStore from "expo-secure-store"
import UUIDService from "../UUID/UUIDService"

export default class SecureStorageService {
  public device_uuid: null | string = null
  private initPromise: Promise<void>

  constructor() {
    this.initPromise = this.initDeviceUUID()
  }

  async initDeviceUUID(): Promise<void> {
    try {
      let uuid: string | null = await SecureStore.getItemAsync("device_uuid")
      console.log("get uuid from store", uuid)
      if (uuid === null) {
        uuid = UUIDService.generateUUID()
        await SecureStore.setItemAsync("device_uuid", uuid)
      }
      this.device_uuid = uuid
    } catch (error) {
      console.log("Error in initDeviceUUID", error)
    }
  }

  async getDeviceUUID() {
    await this.initPromise
    return this.device_uuid
  }

  private async clearDeviceUUID() {
    await SecureStore.deleteItemAsync("device_uuid")
    this.device_uuid = null
  }
}

export const secureStoreInstance = new SecureStorageService()
