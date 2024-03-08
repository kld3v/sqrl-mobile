export interface QrScannerServiceConfig {
  baseURL: string
  headers: { "Content-Type": "application/json"; Accept: "application/json" }
  timeout: 10000
}
