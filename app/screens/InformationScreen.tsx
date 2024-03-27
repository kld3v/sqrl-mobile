import React, { FC } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text } from "../components"
import { colors, spacing, typography } from "../theme"
// import { isRTL } from "../i18n"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import QrlaButton from "app/components/CustomComponents/QrScanner/QrlaButton"
import * as WebBrowser from "expo-web-browser"
import { useNavigation } from "@react-navigation/native"

interface InformationScreenProps extends AppStackScreenProps<"Information"> {}

export const InformationScreen: FC<InformationScreenProps> = observer(function InformationScreen() {
  const text = [
    "1. Point your camera at the QR code, trying to get it inside the frame.",
    "2. Wait for the camera to focus and scan the QR code.",
    "3. Once the QR code is scanned, the app will display the result.",
    "4. If the QR code is a valid QRLA QR code, the app will display the result.",
  ]
  const Navigation = useNavigation()
  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top", "bottom"]}>
      <QrlaButton />
      <Text preset="heading" text="How to use QRLA QR Code Scanner" style={$title} />
      {text.map((item, index) => (
        <Text key={index} style={$description} text={item} />
      ))}
      <Text style={$description}>
        <Text>
          For more information on our security measures, and usage guidelines, please refer to our{" "}
          <Text
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://app.termly.io/document/terms-of-service/e64123bf-73e9-4931-9513-4b5c5239e742",
              )
            }
            style={$link}
            text="Terms and Conditions"
          />
          <Text text=" and " />
          <Text
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://app.termly.io/document/privacy-policy/512bce2e-3988-4d22-a896-1382e94ddbe3",
              )
            }
            style={$link}
            text="Privacy Policy."
          />
        </Text>
      </Text>
      <Button
        text="Scan Now"
        RightAccessory={() => <Icon icon="caretRight" />}
        style={{
          backgroundColor: colors.palette.primary500,
          borderRadius: 25, // Half of the height
          justifyContent: "center",
          alignItems: "center",
          // paddingHorizontal: 30,
          paddingLeft: spacing.lg,
          marginTop: spacing.xl,
          borderWidth: 0,
        }}
        pressedStyle={{
          backgroundColor: colors.palette.primary600,
        }}
        textStyle={{
          color: colors.palette.neutral200,
          fontSize: 22,
          fontFamily: typography.primary.bold,
          paddingTop: 8,
        }}
        //@ts-ignore
        onPress={() => Navigation.navigate("Main")}
      />
    </Screen>
  )
})

const baseTextStyle: TextStyle = {
  textAlign: "center",
}

const $container: ViewStyle = {
  paddingVertical: spacing.xxxl,
  paddingHorizontal: spacing.md,
  justifyContent: "center",
  alignItems: "center",
}

const $title: TextStyle = {
  marginTop: spacing.xxl,
  marginBottom: spacing.sm,
  fontFamily: "Borsok",
  color: colors.palette.primary500,

  ...baseTextStyle,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
  paddingHorizontal: spacing.lg,
  fontFamily: typography.Poppins.medium,
  fontSize: typography.fontSizes.body1,
  ...baseTextStyle,
}

const $link: TextStyle = {
  color: colors.palette.primary600,
  textDecorationLine: "underline",
  fontFamily: typography.Poppins.mediumItalic,
}
