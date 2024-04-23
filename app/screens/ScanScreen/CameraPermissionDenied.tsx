import React from "react"
import { $container } from "./CameraPermissionDenied.styles"
import { Text } from "app/components/Text"

import { Pressable, View } from "react-native"

import * as Linking from "expo-linking"
import { colors, spacing, typography } from "app/theme"

const CameraPermissionDenied: React.FC<{}> = () => {
  return (
    <View style={$container}>
      <Text
        text="Uh oh..."
        preset="heading"
        style={{
          textAlign: "center",
          marginVertical: spacing.xxl,
        }}
      />

      <Text style={{ fontSize: typography.fontSizes.h6, textAlign: "center" }}>
        Looks like you haven't enabled us to use your camera. Please enable this in your{" "}
        <Text
          text="settings"
          style={{
            color: colors.palette.primary500,
            textDecorationLine: "underline",
            fontSize: typography.fontSizes.h6,
          }}
          onPress={async () => await Linking.openSettings()}
        ></Text>{" "}
        so we can scan QR codes. 🐨
      </Text>
    </View>
  )
}

export default CameraPermissionDenied
