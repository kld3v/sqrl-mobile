import { ApiResponse } from "apisauce"

export type AuthApiOKResponse = {
  user: { id: number; name?: string; username: string }
  token: string
}

export type AuthApiErrorResponse = {
  message: string
}

export type RegistrationApiResponse = ApiResponse<AuthApiOKResponse, AuthApiErrorResponse>
