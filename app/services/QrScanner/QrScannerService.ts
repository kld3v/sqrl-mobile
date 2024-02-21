import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { QrScannerServiceConfig } from "./QrScannerService.types"
import { secureStoreInstance } from "../SecureStore/SecureStorageService"

export class QrScannerService {
  config: QrScannerServiceConfig
  apisauce_urlScanEndPoint: ApisauceInstance

  constructor() {
    this.config = {
      baseURL: "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/scan",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      timeout: 10000,
    }
    this.apisauce_urlScanEndPoint = create({
      baseURL: this.config.baseURL,
      headers: this.config.headers,
      timeout: this.config.timeout,
    })
  }
  isUrl(url: string): boolean {
    const regex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?[=&\w]*)?(#[\/\w]*)?$/i
    return regex.test(url)
  }

  getPrimaryDomainName(url: string): string {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
    if (match != null && match.length > 2 && typeof match[2] === "string" && match[2].length > 0) {
      const parts = match[2].split(".")
      return parts[parts.length - 2]
    }
    return url
  }

  async sendUrlAndLocationData(
    url: string,
    latitude: number | undefined,
    longitude: number | undefined,
  ): Promise<ApiResponse<any, any>> {
    const device_uuid = await secureStoreInstance.getDeviceUUID()
    console.log(
      "\n device_uuid being sent off to backend: \n",
      `------------> ${device_uuid} <------------`,
    )
    let res = await this.apisauce_urlScanEndPoint.post("/", {
      url,
      device_uuid,
      latitude,
      longitude,
    })
    return res
  }
}

export const qrScannerService = new QrScannerService()
