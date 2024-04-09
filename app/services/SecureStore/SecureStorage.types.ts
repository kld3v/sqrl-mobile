import { TokenType } from "../Auth"

export interface TSecureStorageService {
  device_uuid: null | string
  initDeviceUUID(): Promise<void>
  getDeviceUUID(): Promise<string | null>
  clearFromSecureStore(key: "device_uuid" | "hasOnboarded"): Promise<void>
  getValueFromSecureStore(key: string): Promise<string | null>
  setValueInSecureStore(key: string, value: string): Promise<void>
}

export type StorageProperties =
  | "device_uuid"
  | "hasOnboarded"
  | "username"
  | "userScore"
  | TokenType
