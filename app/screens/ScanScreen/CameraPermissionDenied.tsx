import React from "react"
import { $container } from "app/components/CustomComponents/QrScanner/QrScannerStyles"
import { Text } from "app/components/Text"
import { Button } from "app/components/Button"
import { View } from "react-native"
import { PermissionResponse } from "expo-notifications"

const CameraPermissionDenied: React.FC<{
  requestPermission: () => Promise<PermissionResponse>
}> = ({ requestPermission }) => {
  return (
    <View style={$container}>
      <Text>We need your permission to show the camera</Text>
      <Button onPress={requestPermission} text="requestPermission" />
    </View>
  )
}

export default CameraPermissionDenied
