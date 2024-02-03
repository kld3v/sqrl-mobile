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
import * as Location from "expo-location"
import { ApiResponse, create } from "apisauce"
import { ScanResponseCard } from "./ScanResponseCard"
import { ReticuleCorner } from "./ReticuleCorner"
import { Reticule } from "./Reticule"

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

        // TODO - Move to global state and use it here
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
    setUrl(qrCodeScan.data)

    if (location) {
      // just get from state - much quicker!
      // let { latitude, longitude, altitude } = location.coords
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))

    if (qrCodeScan.data === "https://qrla.io/") {
      setTrustScore(100)
      setSafe(true)
      setDisplayName("QRLA")
    } else {
      setTrustScore(1)
      setSafe(false)
      setDisplayName(`${qrCodeScan.data}`)
    }
    // try {
    //   let response = await sendUrlAndLocationData(qrCodeScan.data, latitude, longitude, altitude)

    //   console.info(`Response: ${JSON.stringify(response.data)}`)
    //   let trustScore = Number(JSON.stringify(response.data.trust_score))
    //   console.info(`Trust score: ${trustScore}`)
    //   setTrustScore(trustScore)
    //   setSafe(trustScore && trustScore > 50 ? true : false)
    //   setDisplayName("Nandos")
    // } catch (error) {
    //   console.error(`Error with sendUrlAndLocationDatafunction: ${error}`)
    //   setErrorMsg("Oops - Something went wrong :( Please try again")
    // }
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
      <StatusBar style="light" />
      <Camera
        style={$camera}
        type={CameraType.back}
        onBarCodeScanned={scanState === "notScanned" ? onScan : undefined}
      />

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
          destination={displayName}
          url={url}
          scanState={scanState}
          safe={safe}
          setScanState={setScanState}
          errorMessage={errorMsg}
          setErrorMessage={setErrorMsg}
        />
      )}
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
