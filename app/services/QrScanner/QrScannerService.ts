import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { QrScannerServiceConfig } from "./QrScannerService.types"

export class QrScannerService {
  config: QrScannerServiceConfig
  apisauce_urlScanEndPoint: ApisauceInstance

  constructor() {
    this.config = {
      baseURL: "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/scan?",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      timeout: 10000,
    }
    this.apisauce_urlScanEndPoint = create({
      baseURL: this.config.baseURL,
      headers: this.config.headers,
      timeout: this.config.timeout,
    })
  }
  isUrlSafeForKoalasToSendToBackEnd(url: string): boolean {
    const regex =
      /[\w\-]+\.(com|net|org|edu|gov|co|int|eu|us|mil|io|app|dev|ai|biz|info|name|mobi|pro|xxx|asia|cat|coop|jobs|museum|tel|travel|arpa|pdf|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az)/
    return regex.test(url)
  }

  getPrimaryDomainName(url: string): string | null {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
    if (match != null && match.length > 2 && typeof match[2] === "string" && match[2].length > 0) {
      const parts = match[2].split(".")
      return parts[parts.length - 2]
    }
    return null
  }

  async sendUrlAndLocationData(
    url: string,
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<ApiResponse<any, any>> {
    return await this.apisauce_urlScanEndPoint.post("/", {
      url,
      user_id: userId,
      latitude,
      longitude,
    })
  }
}

export const qrScannerService = new QrScannerService()
