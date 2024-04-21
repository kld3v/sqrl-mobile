import { useStores } from "app/models"

import { qrScannerService } from "app/services/QrScanner"

import { AutoFocus, BarCodeScanningResult } from "expo-camera"
import { useCallback, useRef, useState } from "react"
import { ScanStateOptions } from "types"

export default () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [safe, setSafe] = useState<boolean>(false)
  const [url, setUrl] = useState<string>("")
  const [scanState, setScanState] = useState<ScanStateOptions>("notScanned")
  const readyToScan = useRef(true)
  const { locationStore, debugStore, leaderboardStore } = useStores()

  const handleTrustScore = useCallback((trustScore: number | null) => {
    if (typeof trustScore !== "number") {
      setErrorMsg("Oops! Didn't get a trust score back from the server. Try again I guess.")
      return
    }

    const roundedTrustScore = Math.round(trustScore / 100)

    setSafe(roundedTrustScore && roundedTrustScore > 5 ? true : false)
  }, [])

  const scanAgain = useCallback(() => {
    setErrorMsg(null)
    setUrl("")
    setSafe(false)
    setScanState("notScanned")
    readyToScan.current = true
  }, [])

  const onScan = useCallback(async (qrCodeScan: BarCodeScanningResult) => {
    readyToScan.current = false

    setScanState("scanning")

    if (!qrScannerService.isValidUrl(qrCodeScan.data)) {
      setErrorMsg("That doesn't look like a valid URL.")
      setScanState("scanned")
      return
    }

    setUrl(qrCodeScan.data)

    try {
      const response = await qrScannerService.sendUrlAndLocationData(
        qrCodeScan.data,
        locationStore.latitude,
        locationStore.longitude,
      )

      // This ensures `handleTrustScore` is called with a number or null without causing a type error.
      const trustScore = response.data?.trust_score ?? null

      // Check if response.data is undefined and log an error message.
      if (!response.data) {
        debugStore.addErrorMessage(`response.data is undefined: ${response.data}`)
        setErrorMsg("Oops! Didnt get a valid trust score back from the bush. Please try again.")
        return
      }

      handleTrustScore(trustScore)
      await leaderboardStore.bumpUserScore()
    } catch (error) {
      debugStore.addErrorMessage(
        `Error with sendUrlAndLocationDataFunction in QRScannerService: ${error}`,
      )
      setErrorMsg("Oops! Failed to send scan data to the bush. Please try again.")
    }
    setScanState("scanned")
  }, [])

  const [focus, setFocus] = useState<AutoFocus>(AutoFocus.on)

  const updateCameraFocus = () => {
    setFocus(focus === AutoFocus.on ? AutoFocus.off : AutoFocus.on)
  }

  console.log("use scan results called")

  return {
    handleTrustScore,
    scanAgain,
    onScan,
    errorMsg,
    setErrorMsg,
    safe,
    setSafe,
    readyToScan,
    scanState,
    setScanState,
    url,
    setUrl,
    focus,
    updateCameraFocus,
  }
}
