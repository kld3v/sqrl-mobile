import React, { FC } from "react"
import { ImageStyle, Pressable, TextStyle, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { colors, spacing, typography } from "../theme"
// import { isRTL } from "../i18n"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import QrlaButton from "app/components/CustomComponents/QrScanner/QrlaButton"

interface InformationScreenProps extends AppStackScreenProps<"MarketPlace"> {}

export const InformationScreen: FC<InformationScreenProps> = observer(function InformationScreen() {
  const text = [
    "1. Point your camera at the QR code , trying to get it inside the frame.",
    "2. Wait for the camera to focus and scan the QR code.",
    "3. Once the QR code is scanned, the app will display the result.",
    "4. If the QR code is a valid QRLA QR code, the app will display the result.",
  ]
  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <QrlaButton />
      <Text preset="heading" text="How to use QRLA QR Code Scanner" style={$title} />
      {text.map((item, index) => (
        <Text key={index} style={$description} text={item} />
      ))}
      <Text>
        <Text style={$description}>
          For more information on our security measures, and usage guidelines, please refer to our{" "}
          <Text
            onPress={() => alert("hello")}
            style={{ color: colors.textGreen }}
            text="Terms and Conditions"
          />
          <Text text=" and " />
          <Text
            onPress={() => alert("hello")}
            style={{ color: colors.textGreen }}
            text="Privacy Policy."
          />
        </Text>
      </Text>
    </Screen>
  )
})

const baseTextStyle: TextStyle = {
  textAlign: "left",
}

const $container: ViewStyle = {
  paddingTop: spacing.xxxl,
  paddingHorizontal: spacing.lg,
  justifyContent: "center",
  alignItems: "center",
}

const $title: TextStyle = {
  marginTop: spacing.xxl,
  marginBottom: spacing.sm,
  fontFamily: "Borsok",

  ...baseTextStyle,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
  paddingHorizontal: spacing.lg,
  fontFamily: typography.Poppins.medium,
  fontSize: typography.fontSizes.body1,
  ...baseTextStyle,
}
