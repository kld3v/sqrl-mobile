import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { CameraView } from "expo-camera/next"
import { AutoFocus, Camera } from "expo-camera"
import { ScanResponseDisplay } from "../ScanResponseDisplay/ScanResponseDisplay"
import { Reticle } from "../Reticle"
import useScanResults from "./useScanResults"
import { $card, $container, $reticle, $informationIcon } from "./QrScannerStyles"
import QrlaButton from "./QrlaButton"
import DisplayUrlText from "./DisplayUrlText"
import RefreshButton from "./RefreshButton"
import { useEffect, useRef, useState } from "react"

export const QrScanner = observer(function QrScanner() {
  const {
    scanAgain,
    errorMsg,
    onScanModified,
    setErrorMsg,
    safe,
    setReadyToScan,
    readyToScan,
    scanState,
    setScanState,
    url,
  } = useScanResults()

  const [focus, setFocus] = useState<AutoFocus>(AutoFocus.on)
  const cameraRef = useRef(null)

  const updateCameraFocus = () => setFocus(AutoFocus.off)

  // * Switch autofocus back to "on" after 50ms, this refocuses the camera
  useEffect(() => {
    if (focus !== AutoFocus.off) return
    const timeout = setTimeout(() => setFocus(AutoFocus.on), 50)
    return () => clearTimeout(timeout)
  }, [focus])

  // * Refocus camera every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => updateCameraFocus(), 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <View style={$container}>
      {/* <CameraView style={{ flex: 1 }} onBarcodeScanned={readyToScan ? onScanModified : undefined} /> */}

      <Camera
        style={{ flex: 1 }}
        onBarCodeScanned={readyToScan ? onScanModified : undefined}
        ref={cameraRef}
        autoFocus={focus}
      >
        <Reticle
          style={$reticle}
          scanState={scanState}
          safe={safe}
          scanning={scanState === "scanning"}
        />
      </Camera>
      {scanState !== "notScanned" && (
        <ScanResponseDisplay
          style={$card}
          url={url}
          scanState={scanState}
          safe={safe}
          setScanState={setScanState}
          setErrorMessage={setErrorMsg}
          errorMessage={errorMsg}
          setReadyToScan={setReadyToScan}
        />
      )}
      <DisplayUrlText url={url} scanState={scanState} />
      <RefreshButton safe={safe} scanState={scanState} scanAgain={scanAgain} />
    </View>
  )
})
