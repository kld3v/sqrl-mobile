import { Pressable, View } from "react-native"
import { observer } from "mobx-react-lite"

import { Camera } from "expo-camera"
import { ScanResponseDisplay } from "../ScanResponseDisplay/ScanResponseDisplay"
import { Reticle } from "../Reticle"
import useScanResults from "./useScanResults"
import { $card, $container, $reticle } from "./QrScannerStyles"

import DisplayUrlText from "./DisplayUrlText"
import RefreshButton from "./RefreshButton"

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
    focus,
    updateCameraFocus,
  } = useScanResults()

  return (
    <View style={$container}>
      <Pressable style={{ flex: 1 }} onPress={updateCameraFocus}>
        <Camera
          style={{ flex: 1 }}
          onBarCodeScanned={readyToScan ? onScanModified : undefined}
          autoFocus={focus}
        >
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
          setReadyToScan={setReadyToScan}
        />
      )}
      <DisplayUrlText url={url} scanState={scanState} />
      <RefreshButton safe={safe} scanState={scanState} scanAgain={scanAgain} />
    </View>
  )
})
