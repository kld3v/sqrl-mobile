import React from "react"
import { $container, $title } from "./CameraPermissionUndetermined.styles"
import { Text } from "app/components/Text"

import { View } from "react-native"

const CameraPermissionUndetermined: React.FC<{}> = () => {
  return (
    <View style={$container}>
      <Text preset="heading" style={$title}>
        Requesting camera permission...
      </Text>
    </View>
  )
}

export default CameraPermissionUndetermined
