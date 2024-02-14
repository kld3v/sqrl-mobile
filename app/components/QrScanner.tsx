import { Pressable, StyleProp, TextStyle, View, ViewStyle } from "react-native"
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
import { Reticule } from "./Reticule"
import { Entypo } from "@expo/vector-icons"

import * as ExpoTrackingTransparency from "expo-tracking-transparency"

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

  const [safe, setSafe] = useState<boolean>(false)

  const [showCamera, setShowCamera] = useState(false)
  useEffect(() => {
    setShowCamera(true)
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

        const { status } = await ExpoTrackingTransparency.requestTrackingPermissionsAsync()
        if (status === "granted") {
          console.log("Yay! I have user permission to track data")
        }
      } catch (error) {
        console.error(`Failed to get location: ${error}`)
      }
    })()

    // Need to force clean up of the camera component when the user navigates away from the screen. Fixes the weird camera bug which caused black screen when navigating back to the screen.
    return () => {
      setShowCamera(false)
    }
  }, [])

  const urlLocationAPI = create({
    baseURL: "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/scan?",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })

  // TODO: Fix the type of the response
  const sendUrlAndLocationData = async (
    url: string,
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<ApiResponse<any, any>> => {
    // const postData = `url=${encodeURIComponent(url)}&user_id=${encodeURIComponent(
    //   userId,
    // )}&latitude=${latitude}&longitude=${longitude}`

    const postData = {
      url, // No need to encode URI components manually
      user_id: userId, // Use the exact field names expected by your Laravel backend
      latitude,
      longitude,
    }

    return await urlLocationAPI.post("/", postData)
  }

  const onScan = async (qrCodeScan: BarCodeScanningResult) => {
    setScanState("scanning")
    setUrl(qrCodeScan.data)

    // Get Location
    let latitude, longitude
    if (location) {
      // just get from state - much quicker!
      latitude = location.coords.latitude
      longitude = location.coords.longitude
    } else {
      // if location is not available, get it from the API
      const currentLocation = await Location.getCurrentPositionAsync()
      latitude = currentLocation.coords.latitude
      longitude = currentLocation.coords.longitude
    }

    // Send Location and URL to API
    try {
      const userID = 123 // TODO: Replace with actual user ID
      let response = await sendUrlAndLocationData(qrCodeScan.data, userID, latitude, longitude)

      console.info(
        `Response: ${JSON.stringify(response.data)}`,
        `Status: ${response.status}`,
        `qrCodeScan: ${qrCodeScan.data}`,
      )

      let trustScore = Number(JSON.stringify(response.data.trust_score))

      console.info(`Trust score: ${trustScore}`)

      setTrustScore(trustScore)

      setSafe(trustScore && trustScore > 50 ? true : false)

      // setDisplayName("Nandos")
    } catch (error) {
      console.error(`Error with sendUrlAndLocationDatafunction: ${error}`)
      setErrorMsg("Oops - Something went wrong :( Please try again")
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
  const scanAgain =
    (errorMessage: string | null): (() => void) =>
    (): void => {
      errorMessage && setErrorMsg(null)
      setScanState("notScanned")
    }
  return (
    <View style={$styles}>
      <StatusBar style="light" />
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
          scanState={scanState}
          safe={safe}
          setScanState={setScanState}
          errorMessage={errorMsg}
        />
      )}

      {safe && scanState === "scanned" && (
        <View style={$refresh}>
          <Pressable onPress={scanAgain(errorMsg)}>
            <Entypo
              name="leaf"
              size={16}
              color={colors.palette.neutral100}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [{ translateX: -16 }, { translateY: 16 }, { rotate: "-45deg" }],
              }}
            />
            <Entypo
              name="leaf"
              size={16}
              color={colors.palette.neutral100}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [{ translateX: -4 }, { translateY: 16 }, { rotate: "135deg" }],
              }}
            />
          </Pressable>
        </View>
      )}
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "stretch",
}
const $camera: ViewStyle = {
  flex: 1,
  height: "100%",
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
