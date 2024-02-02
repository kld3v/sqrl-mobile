import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Button } from "app/components/Button"
import { LocationObject } from "expo-location"
import { BarCodeScanningResult, Camera, CameraType } from "expo-camera"
import { ScanStateOptions } from "types"
import { useState } from "react"
import { StatusBar } from "expo-status-bar"

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

  const onScan = (event: BarCodeScanningResult) => {
    console.log(event)
    setScanState("scanned")
  }

  return (
    <View style={$styles}>
      <StatusBar style="light" />
      <Camera
        style={$camera}
        type={CameraType.back}
        onBarCodeScanned={scanState === "notScanned" ? onScan : undefined}
      />
    </View>
  )
})

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
