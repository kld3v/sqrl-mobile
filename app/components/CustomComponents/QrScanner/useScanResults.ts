import { useStores } from "app/models"
import { qrScannerService } from "app/services/QrScanner"
import { quintonTheCybear } from "app/utils/QuintonTheCybear"
import { useDebouncedCallback } from "app/utils/useDebouncedCallback"
import { AutoFocus, BarCodeScanningResult } from "expo-camera"
import { useCallback, useState } from "react"
import { ScanStateOptions } from "types"

export default () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [safe, setSafe] = useState<boolean>(false)
  const [url, setUrl] = useState<string>("")
  const [scanState, setScanState] = useState<ScanStateOptions>("notScanned")
  const [readyToScan, setReadyToScan] = useState(true)
  const { locationStore, debugStore } = useStores()

  const handleTrustScore = useCallback((trustScore: number | null) => {
    if (typeof trustScore !== "number") {
      setErrorMsg("Oops! Didn't get a trust score back from the server. Try again I guess.")
      return
    }

    const sanitisedTrustScore = Math.round(trustScore / 100)

    setSafe(sanitisedTrustScore && sanitisedTrustScore > 5 ? true : false)
  }, [])

  const scanAgain = () => {
    setErrorMsg(null)
    setUrl("")
    setSafe(false)
    setScanState("notScanned")
    setReadyToScan(true)
  }

  const onScan = useCallback(async (qrCodeScan: BarCodeScanningResult) => {
    setReadyToScan(false)
    setScanState("scanning")

    if (!qrScannerService.isUrl(qrCodeScan.data)) {
      setErrorMsg("Oops! That doesn't look like a valid URL.")
      setScanState("scanned")
      return
    }

    setUrl(qrCodeScan.data)
    try {
      debugStore.addInfoMessage(
        `sending url and location data to api: ${qrCodeScan.data}, ${locationStore.latitude}, ${locationStore.longitude}`,
      )
      const response: any = await qrScannerService.sendUrlAndLocationData(
        qrCodeScan.data,
        locationStore.latitude,
        locationStore.longitude,
      )
      debugStore.addInfoMessage(`response from api: ${JSON.stringify(response)}`)

      __DEV__ &&
        quintonTheCybear.log(
          "response from the outback...",
          `${JSON.stringify(response.data)} \n
          Trust Score: ${JSON.stringify(response.data.trust_score)}\n
          Status: ${response.status}\n
          qrCodeScan: ${qrCodeScan.data}\n
          latitude: ${locationStore.latitude}\n
          longitude: ${locationStore.longitude}\n`,
        )

      const trustScore = response.data?.trust_score ?? null
      // Check if response.data is undefined and log an error message.
      if (!response.data) {
        debugStore.addErrorMessage("response.data is undefined")
        setErrorMsg("Oops! Didnt get a valid trust score back from the bush. Please try again.")
        return
      }

      // This ensures `handleTrustScore` is called with a number or null without causing a type error.
      handleTrustScore(trustScore)
    } catch (error) {
      console.error(`Error with sendUrlAndLocationDataFunction: ${error}`)
      debugStore.addErrorMessage(
        `Error with sendUrlAndLocationDataFunction in QRScannerService: ${error}`,
      )
      setErrorMsg("Oops! Failed to send scan data to the bush. Please try again.")
    }
    setScanState("scanned")
  }, [])

  const onScanModified = useDebouncedCallback<BarCodeScanningResult[]>(onScan, 100)

  const [focus, setFocus] = useState<AutoFocus>(AutoFocus.on)

  const updateCameraFocus = () => {
    setFocus(focus === AutoFocus.on ? AutoFocus.off : AutoFocus.on)
  }

  return {
    handleTrustScore,
    scanAgain,
    onScanModified,
    onScan,
    errorMsg,
    setErrorMsg,
    safe,
    setSafe,
    setReadyToScan,
    readyToScan,
    scanState,
    setScanState,
    url,
    setUrl,
    focus,
    updateCameraFocus,
  }
}
