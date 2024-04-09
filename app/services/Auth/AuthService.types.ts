export interface IAuthService {
  tokenStrategies: {
    [key: string]: TokenStrategy
  }
  tokens: Record<TokenType, string | null>
}

// Define token types as a union of string literals
export type TokenType = "apple_token" | "google_token"

// Define the shape of a token strategy
export interface TokenStrategy {
  getFromStorage: () => Promise<string | null>
  setInStorage: (value: string) => Promise<void>
}

export type TokenStrategies = {
  [key in TokenType]: TokenStrategy
}
