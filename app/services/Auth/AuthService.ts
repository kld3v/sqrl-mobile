import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import { IAuthService, TokenStrategies, TokenType } from "./AuthService.types"

class AuthService implements IAuthService {
  // Token storage with retrieval and storage strategies
  tokenStrategies: TokenStrategies = {
    apple_token: {
      getFromStorage: () => secureStoreInstance.getValueFromSecureStore("apple_token"),
      setInStorage: (value: string) =>
        secureStoreInstance.setValueInSecureStore("apple_token", value),
    },
    google_token: {
      getFromStorage: () => secureStoreInstance.getValueFromSecureStore("google_token"),
      setInStorage: (value: string) =>
        secureStoreInstance.setValueInSecureStore("google_token", value),
    },
    qrla_token: {
      getFromStorage: () => secureStoreInstance.getValueFromSecureStore("google_token"),
      setInStorage: (value: string) =>
        secureStoreInstance.setValueInSecureStore("google_token", value),
    },
    // Add more tokens here as needed...
  }

  // Explicitly type the tokens object
  tokens: Record<TokenType, string | null> = {
    apple_token: null,
    google_token: null,
    qrla_token: null,
  }

  userCredentials: any = {}

  constructor() {
    this.initializeTokens()
    this.initialiseUserCredentials()
  }

  async initializeTokens() {
    await Promise.all(
      (Object.keys(this.tokenStrategies) as TokenType[]).map(async (key: TokenType) => {
        const token = await this.tokenStrategies[key].getFromStorage()
        this.tokens[key] = token // TypeScript understands token can be string | null
      }),
    )
  }

  async initialiseUserCredentials() {
    this.userCredentials.username = await this.getUsername()
  }

  async tokenDoesExist(): Promise<boolean> {
    const tokenKeys = Object.keys(this.tokens) as TokenType[]
    for (let i = 0; i < tokenKeys.length; i++) {
      const key = tokenKeys[i]
      if (this.tokens[key]) {
        return true
      }
    }
    return false
  }

  // Utility methods to get/set tokens
  async setToken(type: TokenType, value: string) {
    if (this.tokenStrategies[type]) {
      await this.tokenStrategies[type].setInStorage(value)
      this.tokens[type] = value
    }
  }

  async getSpecificToken(type: TokenType): Promise<string | null> {
    if (this.tokens[type]) {
      return this.tokens[type]
    }
    // Optionally refresh from storage or return null
    const token = await this.tokenStrategies[type].getFromStorage()
    this.tokens[type] = token || null
    return this.tokens[type]
  }

  get validToken() {
    const validToken = Object.values(this.tokens).find((token) => token)
    return validToken || null
  }

  async setUsername(value: string) {
    await secureStoreInstance.setValueInSecureStore("username", value)
  }

  async getUsername() {
    return await secureStoreInstance.getValueFromSecureStore("username")
  }

  async logout() {
    // Iterate over each token type and remove it from secure storage
    await Promise.all(
      (Object.keys(this.tokenStrategies) as TokenType[]).map(async (key: TokenType) => {
        await secureStoreInstance.clearFromSecureStore(key)
      }),
    )

    // Reset the tokens in memory
    this.tokens = {
      apple_token: null,
      google_token: null,
      qrla_token: null,
    }
  }
}

export const authService = new AuthService()
