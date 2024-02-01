import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Button } from "app/components/Button"

import { Camera, CameraType } from "expo-camera"

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
      <Camera
        style={$camera}
        type={CameraType.back}
        onBarCodeScanned={(event) => {
          console.log(event)
        }}
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
