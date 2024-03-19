import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { CameraView } from "expo-camera/next"
import { ScanResponseDisplay } from "../ScanResponseDisplay/ScanResponseDisplay"
import { Reticle } from "../Reticle"
import useScanResults from "./useScanResults"
import { $card, $container, $reticle, $informationIcon } from "./QrScannerStyles"
import QrlaButton from "./QrlaButton"
import DisplayUrlText from "./DisplayUrlText"
import RefreshButton from "./RefreshButton"

import { Carousel } from "app/components/Carousel"
import { useStores } from "app/models"
import useOnboarding from "./useOnboarding"
import { Icon } from "app/components/Icon"
import { colors } from "app/theme"
import { useNavigation } from "@react-navigation/native"

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

  const { onboardingStore } = useStores()
  const navigation = useNavigation()

  useOnboarding()

  return (
    <View style={$container}>
      <Icon
        icon="information"
        color={colors.tint}
        containerStyle={$informationIcon}
        size={32}
        // @ts-ignore
        onPress={() => navigation.navigate("Information")}
      />
      <QrlaButton />
      <CameraView style={{ flex: 1 }} onBarcodeScanned={readyToScan ? onScanModified : undefined} />
      <Reticle
        style={$reticle}
        scanState={scanState}
        safe={safe}
        scanning={scanState === "scanning"}
      />
      {!onboardingStore.hasOnboarded && (
        <Carousel
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 5,
          }}
        />
      )}
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
