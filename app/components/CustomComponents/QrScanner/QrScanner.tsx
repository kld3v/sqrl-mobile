import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "app/components/Text"
import { Button } from "app/components/Button"
import { AutoFocus, Camera } from "expo-camera"
import { ScanResponseDisplay } from "../ScanResponseDisplay/ScanResponseDisplay"
import { Reticule } from "../Reticule"
import useScanResults from "./useScanResults"
import { $camera, $card, $container, $reticule } from "./QrScannerStyles"
import QrlaButton from "./QrlaButton"
import DisplayUrlText from "./DisplayUrlText"
import RefreshButton from "./RefreshButton"

export const QrScanner = observer(function QrScanner() {
  const [permission, requestPermission] = Camera.useCameraPermissions()

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

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={$container}>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} text="requestPermission" />
      </View>
    )
  }

  return (
    <View style={$container}>
      <QrlaButton />
      <Camera
        autoFocus={AutoFocus.on}
        focusDepth={1}
        style={$camera}
        ratio="16:9"
        onBarCodeScanned={readyToScan ? onScanModified : undefined}
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
