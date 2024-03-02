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
