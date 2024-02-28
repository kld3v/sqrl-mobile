import * as Crypto from "expo-crypto"

export default class UUIDService {
  public static generateUUID(): string {
    return Crypto.randomUUID()
  }
}
