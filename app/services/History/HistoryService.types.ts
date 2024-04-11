export type Scan = {
  url_id: number
  url: string
  date_and_time: string
  trust_score: number
  is_favourite: boolean
  scan_type: ScanType
}

export type ScanType = "Camera" | "History" | "Favourites" | "EQR" | "NFC"
