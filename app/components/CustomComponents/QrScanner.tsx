import { Pressable, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Button } from "app/components/Button"
import { BarCodeScanningResult, Camera, CameraType } from "expo-camera"
import { ScanStateOptions } from "types"
import { useEffect, useState } from "react"

import { ApiResponse } from "apisauce"
import { ScanResponseCard } from "./ScanResponseCard"
import { Reticule } from "./Reticule"
import { qrScannerService } from "app/services/QrScanner"

import { useStores } from "app/models"
import { AutoImage } from "../AutoImage"
import { quintonTheCybear } from "app/utils/QuintonTheCybear"

export interface QrScannerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const QrScanner = observer(function QrScanner(props: QrScannerProps) {
  const { locationStore } = useStores()
  const { style } = props
  const $styles = [$container, style]
  const [permission, requestPermission] = Camera.useCameraPermissions()
  const [scanState, setScanState] = useState<ScanStateOptions>("scanned")
  const [url, setUrl] = useState<string>("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [trustScore, setTrustScore] = useState<number | null>(null)

  const [safe, setSafe] = useState<boolean>(false)

  const [showCamera, setShowCamera] = useState(false)

  useEffect(() => {
    setShowCamera(true)
    // Need to force clean up of the camera component when the user navigates away from the screen.
    return () => {
      setShowCamera(false)
    }
  }, [])

  const handleTrustScore = (trustScore: number | null) => {
    if (typeof trustScore !== "number") {
      setErrorMsg("Oops! Didn't get a trust score back from the server. Try again I guess.")
      return
    }
    const sanitisedTrustScore = Math.round(trustScore / 100)

    setTrustScore(sanitisedTrustScore)
    setSafe(sanitisedTrustScore && sanitisedTrustScore > 5 ? true : false)
  }

  const scanAgain = (): (() => void) => (): void => {
    setErrorMsg(null)
    setUrl("")
    setTrustScore(null)
    setSafe(false)
    setScanState("notScanned")
    setShowCamera(false)
    setShowCamera(true)
  }

  const onScan = async (qrCodeScan: BarCodeScanningResult): Promise<void> => {
    setScanState("scanning")
    if (!qrScannerService.isUrl(qrCodeScan.data)) {
      setErrorMsg("Oops! That doesn't look like a valid URL.")
      setScanState("scanned")
      return
    }
    setUrl(qrCodeScan.data)
    try {
      let response: ApiResponse<any, any> = await qrScannerService.sendUrlAndLocationData(
        qrCodeScan.data,
        locationStore.latitude,
        locationStore.longitude,
      )

      quintonTheCybear.log("response from the outback...", [
        `${JSON.stringify(response.data)} \n`,
        `Trust Score: ${JSON.stringify(response.data.trust_score)}\n`,
        `Status: ${response.status}\n`,
        `qrCodeScan: ${qrCodeScan.data}\n`,
        `latitude: ${locationStore.latitude}\n`,
        `longitude: ${locationStore.longitude}\n`,
      ])

      handleTrustScore(response.data.trust_score)
    } catch (error) {
      console.error(`Error with sendUrlAndLocationDataFunction: ${error}`)
      setErrorMsg("Oops! Failed to send scan data to the bush. Please try again.")
    }

    setScanState("scanned")
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={$container}>
        <Text style={$text}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} text="requestPermission" />
      </View>
    )
  }

  return (
    <View style={$styles}>
      <AutoImage
        style={{
          height: 80,
          width: 80,
          margin: spacing.md,
          zIndex: 99,
          position: "absolute",
          top: 0,
          right: 0,
        }}
        source={require("../../../assets/images/winkface.png")}
        resizeMode="contain"
      />

      {showCamera && (
        <Camera
          style={$camera}
          type={CameraType.back}
          ratio="16:9"
          onBarCodeScanned={scanState === "notScanned" ? onScan : undefined}
        />
      )}

      <Reticule
        style={$reticule}
        scanState={scanState}
        safe={safe}
        scanning={scanState === "scanning"}
      />

      {scanState !== "notScanned" && (
        <ScanResponseCard
          style={$card}
          trustScore={trustScore}
          url={url}
          setUrl={setUrl}
          scanState={scanState}
          safe={safe}
          setSafe={setSafe}
          setScanState={setScanState}
          setErrorMessage={setErrorMsg}
          errorMessage={errorMsg}
        />
      )}

      {safe && scanState === "scanned" && (
        <View style={$refresh}>
          <Pressable onPress={scanAgain()}>
            <AutoImage
              source={require("../../../assets/images/refreshButton.png")}
              style={{ width: 48, height: 48 }}
            />
          </Pressable>
        </View>
      )}
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
}
const $camera: ViewStyle = {
  flex: 1,
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: 1,
}

const $image: ViewStyle = {
  width: 200,
  height: 200,
  position: "absolute",
  left: "50%",
  top: "50%",
  marginLeft: -100, // half of width to center
  marginTop: -100, // half of height to center
  zIndex: 3,
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const $reticule: ViewStyle = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 200,
  height: 200,
  marginLeft: -100, // half of width to center
  marginTop: -100, // half of height to center
  zIndex: 3,
}

const $refresh: ViewStyle = {
  position: "absolute",
  bottom: 10,
  right: 10,
  backgroundColor: colors.palette.neutral200,
  width: 48,
  height: 48,
  borderRadius: 50,

  zIndex: 999,

  transform: [{ rotate: "120deg" }],

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5, // for Android
}

const $card: TextStyle = {
  color: colors.palette.primary500,
  fontSize: 20,
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 200,
  height: 200,
  marginLeft: -100, // half of width to center
  marginTop: -100, // half of height to center
}
