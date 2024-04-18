import { Platform, Pressable, View } from "react-native"
import { observer } from "mobx-react-lite"

import { BarCodeScanningResult, Camera } from "expo-camera"
import { CameraView } from "expo-camera/next"
import { ScanResponseDisplay } from "../ScanResponseDisplay/ScanResponseDisplay"
import { Reticle } from "../Reticle"
import useScanResults from "./useScanResults"
import { $card, $container, $reticle } from "./QrScannerStyles"
import RefreshButton from "./RefreshButton"

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

  return (
    <View style={$container}>
      <Pressable style={{ flex: 1 }} onPress={updateCameraFocus}>
        {Platform.OS === "ios" ? (
          <Camera style={{ flex: 1 }} onBarCodeScanned={handleScan} autoFocus={focus} />
        ) : (
          <>
            <CameraView style={{ flex: 1 }} onBarcodeScanned={handleScan} />
          </>
        )}

        <Reticle
          style={$reticle}
          scanState={scanState}
          safe={safe}
          scanning={scanState === "scanning"}
        />
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
      <RefreshButton safe={safe} scanState={scanState} scanAgain={scanAgain} />
    </View>
  )
})
