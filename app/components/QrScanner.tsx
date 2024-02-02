import { StyleProp, TextStyle, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Button } from "app/components/Button"
import { LocationObject } from "expo-location"
import { BarCodeScanningResult, Camera, CameraType } from "expo-camera"
import { ScanStateOptions } from "types"
import { useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { BarCodeScanner } from "expo-barcode-scanner"
import * as Location from "expo-location"
import { ApiResponse, create } from "apisauce"
import { Card } from "./Card"
import { ScanResponseCard } from "./ScanResponseCard"

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
  const { style } = props
  const $styles = [$container, style]
  const [permission, requestPermission] = Camera.useCameraPermissions()
  const [scanState, setScanState] = useState<ScanStateOptions>("notScanned")
  const [hasPermission, setHasPermission] = useState<string | boolean>("not_requested")
  const [url, setUrl] = useState<string>("")
  const [location, setLocation] = useState<LocationObject>()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [trustScore, setTrustScore] = useState<number | null>(null)
  const [displayName, setDisplayName] = useState<string>("")
  const [safe, setSafe] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      try {
        // I'm acquring this on user launch. This is because it can take a few seconds to attain the location. If already attained, I can use the much quicker API call getLastKnownPositionAsync() when the user scans to reduce wait time.
        // However this is going to require some testing to ensure getLastKnownPositionAsync() returns this location rather than an incorrect location.
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync()
        if (__DEV__) console.info(foregroundStatus)

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        })
        setLocation(location)
        if (__DEV__) console.info(location)
      } catch (error) {
        console.error(`Failed to get location: ${error}`)
      }
    })()
  }, [])

  const urlLocationAPI = create({
    baseURL: "http://192.168.1.151:8000/api/receiveUrlData",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })

  // TODO: Fix the type of the response
  const sendUrlAndLocationData = async (
    data: string,
    latitude: number,
    longitude: number,
    altitude: number | null,
  ): Promise<ApiResponse<any, any>> => {
    return await urlLocationAPI.post("/", {
      url: data,
      location: {
        latitude,
        longitude,
        altitude,
      },
    })
  }

  const onScan = async (qrCodeScan: BarCodeScanningResult) => {
    setScanState("scanning")
    console.info(`Scanned QR code: ${qrCodeScan.data}`)
    setUrl(qrCodeScan.data)
    let location = await Location.getLastKnownPositionAsync({})
    if (!location) {
      alert("Failed to attain location: please scan again")
      return
    }
    setLocation(location)
    let { latitude, longitude, altitude } = location.coords
    console.info(`Latitude: ${latitude}, Longitude: ${longitude}, Altitude: ${altitude}`)
    try {
      let response = await sendUrlAndLocationData(qrCodeScan.data, latitude, longitude, altitude)

      console.info(`Response: ${JSON.stringify(response.data)}`)
      let trustScore = Number(JSON.stringify(response.data.trust_score))
      console.info(`Trust score: ${trustScore}`)
      setTrustScore(trustScore)
      setSafe(trustScore && trustScore > 50 ? true : false)
      setDisplayName("Nandos")
    } catch (error) {
      console.error(`Error with sendUrlAndLocationDatafunction: ${error}`)
      setErrorMsg("Oops - Something went wrong :( Please try again")
    }
    setScanState("scanned")
    alert(`Scanned QR code: ${qrCodeScan.data}, trust score: ${trustScore}`)
  }

  const Corner = ({
    position,
    scanning,
  }: {
    position: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight"
    scanning: boolean
    safe: boolean
  }) => (
    <View
      style={[
        styles[`corner${position}`],
        scanning && $scanningCorner,
        scanState === "scanned" ? (safe ? $scannedSafe : $scannedUnsafe) : null,
      ]}
    />
  )

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
      <StatusBar style="light" />
      <Camera
        style={$camera}
        type={CameraType.back}
        onBarCodeScanned={scanState === "notScanned" ? onScan : undefined}
      />
      <View style={$reticule}>
        <Corner position="TopLeft" scanning={scanState === "scanning"} safe={safe} />
        <Corner position="TopRight" scanning={scanState === "scanning"} safe={safe} />
        <Corner position="BottomLeft" scanning={scanState === "scanning"} safe={safe} />
        <Corner position="BottomRight" scanning={scanState === "scanning"} safe={safe} />
      </View>
      {/* <ScanResponseCard style={$card} /> */}
    </View>
  )
})

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
const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const $camera: ViewStyle = {
  height: "100%",
  width: "100%",
}

const $reticule: ViewStyle = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 200,
  height: 200,
  marginLeft: -100, // half of width to center
  marginTop: -100, // half of height to center
}

const styles = StyleSheet.create({
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderColor: "white",
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderColor: "white",
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderColor: "white",
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderColor: "white",
    borderBottomRightRadius: 10,
  },
})

const $scanningCorner: ViewStyle = {
  borderColor: colors.palette.neutral100,
}

const $scannedSafe: ViewStyle = {
  borderColor: colors.palette.primary500,
}

const $scannedUnsafe: ViewStyle = {
  borderColor: colors.palette.angry500,
}
