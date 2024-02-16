export interface QrVenueNotificationsConfig {
  baseUrl_locationEndPoint: "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/venues/location"
  baseUrl_nearbyEndPoint: "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/venues/nearby"
  timeout: number
  headers: {
    Accept: string
    "Accept-encoding": string
    "Content-Type": string
  }
}
<<<<<<< HEAD

export type QrVenueNotificationApiResponse = {
  address: string | null
  chain: string
  company: string
  google_maps: string | null
  id: number
  postcode: string | null
  tel: string | null
  url: {
    created_at: string
    id: number
    trust_score: number
    updated_at: string
    url: string
  }
  url_id: number
}
=======
>>>>>>> e1d1f2f01f095e92a707aca4851c9ea1cd679ba8
