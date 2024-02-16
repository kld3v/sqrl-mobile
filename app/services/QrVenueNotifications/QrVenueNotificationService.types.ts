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
