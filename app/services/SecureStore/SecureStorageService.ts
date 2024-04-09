import * as SecureStore from "expo-secure-store"
import UUIDService from "../UUID/UUIDService"
import { StorageProperties, TSecureStorageService } from "./SecureStorage.types"

export default class SecureStorageService implements TSecureStorageService {
  public device_uuid: null | string = null

  private initPromise: Promise<void>

  constructor() {
    this.initPromise = this.initDeviceUUID()
  }

  public async initDeviceUUID(): Promise<void> {
    try {
      let uuid: string | null = await SecureStore.getItemAsync("device_uuid")
      if (uuid === null) {
        uuid = UUIDService.generateUUID()
        await SecureStore.setItemAsync("device_uuid", uuid)
      }
      this.device_uuid = uuid
    } catch (error) {
      console.log("Error in initDeviceUUID", error)
    }
  }

  public async getDeviceUUID() {
    await this.initPromise
    return this.device_uuid
  }

  public async clearFromSecureStore(key: StorageProperties) {
    return SecureStore.deleteItemAsync(key)
  }

  public async getValueFromSecureStore(key: string) {
    return SecureStore.getItemAsync(key)
  }

  public async setValueInSecureStore(key: string, value: string) {
    return SecureStore.setItemAsync(key, value)
  }
}

export const secureStoreInstance = new SecureStorageService()
