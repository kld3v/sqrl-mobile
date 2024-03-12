import { View } from "react-native"
import { observer } from "mobx-react-lite"

import { CameraView } from "expo-camera/next"
import { ScanResponseDisplay } from "../ScanResponseDisplay/ScanResponseDisplay"
import { Reticule } from "../Reticule"
import useScanResults from "./useScanResults"
import { $camera, $card, $container, $reticule } from "./QrScannerStyles"
import QrlaButton from "./QrlaButton"
import DisplayUrlText from "./DisplayUrlText"
import RefreshButton from "./RefreshButton"

export const QrScanner = observer(function QrScanner() {
  const {
    scanAgain,
    errorMsg,
    onScanModified,
    onScan,
    setErrorMsg,
    safe,
    setReadyToScan,
    readyToScan,
    scanState,
    setScanState,
    url,
  } = useScanResults()

  CameraView.launchScanner({
    barcodeTypes: [
      "aztec",
      "ean13",
      "ean8",
      "qr",
      "pdf417",
      "upc_e",
      "datamatrix",
      "code39",
      "code93",
      "itf14",
      "codabar",
      "code128",
      "upc_a",
    ],
    isHighlightingEnabled: true,
  })

  return (
    <View style={$container}>
      <QrlaButton />
      <CameraView
        // style={$camera}
        style={{ flex: 1 }}
        onBarcodeScanned={readyToScan ? onScan : undefined}
      />
      <Reticule
        style={$reticule}
        scanState={scanState}
        safe={safe}
        scanning={scanState === "scanning"}
      />
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
