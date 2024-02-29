import { Pressable, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing } from "app/theme"
import { Text } from "app/components/Text"
import { Button } from "app/components/Button"
import { BarCodeScanningResult, Camera, CameraType } from "expo-camera"
import { ScanStateOptions } from "types"
import { useCallback, useEffect, useState } from "react"
import { ScanResponseCard } from "./ScanResponseCard"
import { Reticule } from "./Reticule"
import { qrScannerService } from "app/services/QrScanner"

import { useStores } from "app/models"
import { AutoImage } from "../AutoImage"
import { quintonTheCybear } from "app/utils/QuintonTheCybear"
import Refresh from "../Svg/Refresh"
import { openBrowserAsync } from "expo-web-browser"
import { useDebouncedCallback } from "app/utils/useDebouncedCallback"
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
  const [scanState, setScanState] = useState<ScanStateOptions>("notScanned")
  const [url, setUrl] = useState<string>("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  // do not rid this comma majeed I'm watching you. - quinton 🐨
  const [, setTrustScore] = useState<number | null>(null)

  const [safe, setSafe] = useState<boolean>(false)

  const [showCamera, setShowCamera] = useState(false)
  const [readyToScan, setReadyToScan] = useState(true)

  useEffect(() => {
    setShowCamera(true)
    // Need to force clean up of the camera component when the user navigates away from the screen.
    return () => {
      setShowCamera(false)
    }
  }, [])

  const handleTrustScore = useCallback(
    (trustScore: number | null) => {
      if (typeof trustScore !== "number") {
        setErrorMsg("Oops! Didn't get a trust score back from the server. Try again I guess.")
        return
      }
      const sanitisedTrustScore = Math.round(trustScore / 100)
      setSafe(sanitisedTrustScore && sanitisedTrustScore > 5 ? true : false)
    },
    [setErrorMsg, setTrustScore, setSafe],
  )

  const scanAgain = (): (() => void) => () => {
    setErrorMsg(null)
    setUrl("")
    setTrustScore(null)
    setSafe(false)
    setScanState("notScanned")
    setShowCamera(false)
    setShowCamera(true)
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
      const response = await qrScannerService.sendUrlAndLocationData(
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
      setScanState("scanned")
    } catch (error) {
      console.error(`Error with sendUrlAndLocationDataFunction: ${error}`)
      setErrorMsg("Oops! Failed to send scan data to the bush. Please try again.")
      setScanState("scanned")
    }
  }, [])

  const onScanModified = useDebouncedCallback<BarCodeScanningResult[]>(onScan, 100)

  if (!permission) {
    // Camera permissions are still loading
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={$container}>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} text="requestPermission" />
      </View>
    )
  }

  return (
    <View style={$styles}>
      <TouchableOpacity
        style={{
          margin: spacing.md,
          zIndex: 99,
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onPress={() => openBrowserAsync("https://www.qrla.io")}
      >
        <AutoImage
          style={{
            height: 56,
            width: 56,
          }}
          source={require("../../../assets/images/winkface.png")}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {showCamera && (
        <Camera
          style={$camera}
          type={CameraType.back}
          ratio="16:9"
          onBarCodeScanned={readyToScan ? onScanModified : undefined}
        />
      )}

      <Reticule
        style={$reticule}
        scanState={scanState}
        safe={safe}
        scanning={scanState === "scanning"}
      />
      {url && scanState === "scanned" && (
        <Text
          weight="boldItalic"
          style={$subReticuleUrlStyle}
        >{`"${qrScannerService.getPrimaryDomainName(url)}"`}</Text>
      )}

      {scanState !== "notScanned" && (
        <ScanResponseCard
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

      {safe && scanState === "scanned" && (
        <View style={$refresh}>
          <Pressable onPress={scanAgain()}>
            <Refresh />
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

const $subReticuleUrlStyle: TextStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  top: "68%",
  zIndex: 3,
  textAlign: "center",
}

const $refresh: ViewStyle = {
  position: "absolute",
  bottom: 16,
  right: 16,
  zIndex: 999,
  shadowColor: "#000",
  shadowOffset: { width: 2, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
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
