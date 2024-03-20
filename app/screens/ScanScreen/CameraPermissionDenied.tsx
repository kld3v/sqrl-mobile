import React from "react"
import { $container, $textContainer } from "./CameraPermissionDenied.styles"
import { Text } from "app/components/Text"
import { Button } from "app/components/Button"
import { Pressable, View } from "react-native"
import { PermissionResponse, PermissionStatus } from "expo-camera/next"
import * as Linking from "expo-linking"
import { colors } from "app/theme"

const CameraPermissionDenied: React.FC<{
  requestPermission: () => Promise<PermissionResponse>
  permissionStatus?: PermissionStatus
}> = ({ requestPermission, permissionStatus }) => {
  const openSettings = async () => {
    await Linking.openSettings()
  }
  const renderCameraPermissionDenied = () => {
    if (permissionStatus === "denied") {
      return (
        <Text style={$textContainer}>
          Camera permission denied. Please enable this in your{" "}
          <Pressable>
            <Text
              style={{ color: colors.palette.primary500, textDecorationLine: "underline" }}
              onPress={openSettings}
            >
              settings
            </Text>
          </Pressable>
        </Text>
      )
    }
    if (permissionStatus === "undetermined") {
      return (
        <>
          <Text style={$textContainer}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} text="requestPermission" />
        </>
      )
    }
    return null
  }
  return <View style={$container}>{renderCameraPermissionDenied()}</View>
}

export default CameraPermissionDenied
