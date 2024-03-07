import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { QrScannerServiceConfig } from "./QrScannerService.types"
import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import { quintonTheCybear } from "app/utils/QuintonTheCybear"
import { DEFAULT_API_CONFIG } from "../api"

export class QrScannerService {
  apisauce: ApisauceInstance

  constructor() {
    this.apisauce = create({
      baseURL: "https://app.qrla.io/api",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
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

  async sendUrlAndLocationDataToHttpURLWithAPISauce(
    url: string,
    latitude?: number,
    longitude?: number,
  ): Promise<ApiResponse<any, any>> {
    const device_uuid = await secureStoreInstance.getDeviceUUID()

    if (!device_uuid) throw new Error("Wasn't able to get device uuid from secure store")

    let requestBody: {
      url: string
      device_uuid: string
      latitude?: number
      longitude?: number
    } = {
      url,
      device_uuid,
    }

    if (typeof latitude !== "undefined") {
      requestBody.latitude = latitude
    }

    if (typeof longitude !== "undefined") {
      requestBody.longitude = longitude
    }

    let tempApiSauceInstance = create({
      baseURL: "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    })

    return await tempApiSauceInstance.post("/scan", requestBody)
  }

  async sendUrlAndLocationData(
    url: string,
    latitude?: number,
    longitude?: number,
  ): Promise<ApiResponse<any, any>> {
    const device_uuid = await secureStoreInstance.getDeviceUUID()

    if (!device_uuid) throw new Error("Wasn't able to get device uuid from secure store")

    let requestBody: {
      url: string
      device_uuid: string
      latitude?: number
      longitude?: number
    } = {
      url,
      device_uuid,
    }

    if (typeof latitude !== "undefined") {
      requestBody.latitude = latitude
    }

    if (typeof longitude !== "undefined") {
      requestBody.longitude = longitude
    }

    return await this.apisauce.post("/scan", requestBody)
  }
}

export const qrScannerService = new QrScannerService()
