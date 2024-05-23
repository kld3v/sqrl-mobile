import { ApiResponse } from "apisauce"
import { useStores } from "app/models"

import { qrScannerService } from "app/services/QrScanner"

import { AutoFocus, BarCodeScanningResult } from "expo-camera/legacy"
import { useCallback, useRef, useState } from "react"
import { ScanStateOptions } from "types"

export default () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [safe, setSafe] = useState<boolean>(false)
  const [url, setUrl] = useState<string>("")
  const [zoom, setZoom] = useState(0)
  const [scanState, setScanState] = useState<ScanStateOptions>("notScanned")
  const readyToScan = useRef(true)
  const { locationStore, debugStore, leaderboardStore } = useStores()
  const setCancelMidScan = useRef(false)

  const handleTrustScore = useCallback((trustScore: number | null) => {
    console.log(trustScore)
    if (typeof trustScore !== "number") {
      debugStore.addErrorMessage(
        `trustScore passed to handleTrustScore:${trustScore} which is type of: ${typeof trustScore}`,
      )
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
    setZoom(0)
  }, [])

  const timeout = useCallback((ms: number, promise: Promise<ApiResponse<any, any>>) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Took too long to get a response from the server. Please try again..."))
      }, ms)

      promise.then(
        (res) => {
          clearTimeout(timer)
          resolve(res)
        },
        (err) => {
          clearTimeout(timer)
          reject(err)
        },
      )
    })
  }, [])

  const onScan = useCallback(async (qrCodeScan: BarCodeScanningResult) => {
    readyToScan.current = false
    setCancelMidScan.current = false
    setScanState("scanning")

    if (!qrScannerService.isValidUrl(qrCodeScan.data)) {
      setErrorMsg("That doesn't look like a valid URL.")
      setScanState("scanned")
      return
    }

    setUrl(qrCodeScan.data)

    try {
      //TODO Fix Type
      const response: any = await timeout(
        10000,
        qrScannerService.sendUrlAndLocationData(
          qrCodeScan.data,
          locationStore.latitude,
          locationStore.longitude,
        ),
      )

      if (setCancelMidScan.current) {
        console.log("scan cancelled...")
        return
      }

      if (!response.ok) {
        debugStore.addErrorMessage(`res.data.problem is: ${response.data?.problem}`)
        setErrorMsg(`Oops! ${response.data?.problem} :(`)
        setScanState("scanned")
        return
      }

      if (!response.data) {
        debugStore.addErrorMessage(`response.data is undefined: ${response.data}`)
        setErrorMsg("Oops! Didnt get a valid trust score back from the bush. Please try again.")
        setScanState("scanned")
        return
      }

      const trustScore = response.data?.trust_score ?? null
      handleTrustScore(trustScore)
      await leaderboardStore.bumpUserScore()
    } catch (error) {
      debugStore.addErrorMessage(
        `Error with sendUrlAndLocationDataFunction in QRScannerService: ${error}. Troublesome url: ${qrCodeScan.data}`,
      )
      setErrorMsg(`${error}`)
      setUrl("")
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
    setCancelMidScan,
    zoom,
    setZoom,
  }
}
