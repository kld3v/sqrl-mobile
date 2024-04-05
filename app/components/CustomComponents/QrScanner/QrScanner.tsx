import { Pressable, View } from "react-native"
import { observer } from "mobx-react-lite"

import { BarCodeScanningResult, Camera } from "expo-camera"
import { ScanResponseDisplay } from "../ScanResponseDisplay/ScanResponseDisplay"
import { Reticle } from "../Reticle"
import useScanResults from "./useScanResults"
import { $card, $container, $reticle } from "./QrScannerStyles"

import DisplayUrlText from "./DisplayUrlText"
import RefreshButton from "./RefreshButton"
import LottieView from "lottie-react-native"
import { useRef } from "react"

export const QrScanner = observer(function QrScanner() {
  const {
    scanAgain,
    errorMsg,
    onScan,
    setErrorMsg,
    safe,
    readyToScan,
    scanState,
    setScanState,
    url,
    focus,
    updateCameraFocus,
  } = useScanResults()

  const handleScan = (barcodeScanResult: BarCodeScanningResult) => {
    if (readyToScan.current) {
      onScan(barcodeScanResult)
    }
  }
  const animation = useRef(null)
  return (
    <View style={$container}>
      <Pressable style={{ flex: 1 }} onPress={updateCameraFocus}>
        <Camera style={{ flex: 1 }} onBarCodeScanned={handleScan} autoFocus={focus}>
          <Reticle
            style={$reticle}
            scanState={scanState}
            safe={safe}
            scanning={scanState === "scanning"}
          />
        </Camera>
      </Pressable>

      {scanState !== "notScanned" && (
        <ScanResponseDisplay
          style={$card}
          url={url}
          scanState={scanState}
          safe={safe}
          setScanState={setScanState}
          setErrorMessage={setErrorMsg}
          errorMessage={errorMsg}
          readyToScan={readyToScan}
        />
      )}
      <DisplayUrlText url={url} scanState={scanState} />
      <RefreshButton safe={safe} scanState={scanState} scanAgain={scanAgain} />
    </View>
  )
})
