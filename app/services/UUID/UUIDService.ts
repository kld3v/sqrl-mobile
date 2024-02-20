import { v4 as uuidv4 } from "uuid"

export default class UUIDService {
  public static generateUUID(): string {
    return uuidv4()
  }
}
