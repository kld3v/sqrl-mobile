import { ApiResponse } from "apisauce"

export type AuthApiOKResponse = {
  username: string
  token: string
}

export type AuthApiErrorResponse = {
  errors: {
    username?: string[]
    email?: string[]
    password?: string[]
  }
}

export type OAuthApiErrorResponse = {
  errors: string
}

export type AuthAPIResponse = ApiResponse<
  AuthApiOKResponse,
  AuthApiErrorResponse | OAuthApiErrorResponse
>
