import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { QrScannerServiceConfig } from "./QrScannerService.types"
import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import { quintonTheCybear } from "app/utils/QuintonTheCybear"
import { DEFAULT_API_CONFIG } from "../api"

export class QrScannerService {
  config: QrScannerServiceConfig
  apisauce_urlScanEndPoint: ApisauceInstance

  constructor() {
    this.config = {
      baseURL: DEFAULT_API_CONFIG.url,
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
    if (match && match[2]) {
      const parts = match[2].split(".")
      // Handling for known SLDs with ccTLDs like '.co.uk'
      if (parts.length > 2) {
        // Identify if the last two parts match known SLD + ccTLD patterns
        const knownSLDs = ["co.uk", "org.uk", "com.au", "co.nz", "co.za", "com.sg"]
        const lastTwo = parts.slice(-2).join(".")
        if (knownSLDs.includes(lastTwo)) {
          return parts.slice(-3, -2).join() // Return the part just before the SLD + ccTLD
        } else {
          return parts.slice(-2, -1).join() // Return the second level domain
        }
      } else {
        return parts.slice(-2, -1).join() // Directly return the domain if there's no SLD + ccTLD pattern
      }
    }
    return url // Return the original URL if no match is found
  }

  async sendUrlAndLocationData(
    url: string,
    latitude?: number,
    longitude?: number,
  ): Promise<ApiResponse<any, any>> {
    const device_uuid = await secureStoreInstance.getDeviceUUID()
    quintonTheCybear.log("device_uuid being sent off to backend: ", device_uuid)

    if (!device_uuid) throw new Error("Wasn't able to get device uuid from secure store")
    // Initialize the body with required properties
    let requestBody: {
      url: string
      device_uuid: string
      latitude?: number
      longitude?: number
    } = {
      url,
      device_uuid,
    }

    // Conditionally add latitude and longitude if they are not undefined
    if (typeof latitude !== "undefined") {
      requestBody.latitude = latitude
    }
    if (typeof longitude !== "undefined") {
      requestBody.longitude = longitude
    }

    let res = await this.apisauce_urlScanEndPoint.post("/scan", requestBody)
    return res
  }
}

export const qrScannerService = new QrScannerService()
