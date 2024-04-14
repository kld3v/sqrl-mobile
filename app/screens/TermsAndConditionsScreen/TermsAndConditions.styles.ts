import { spacing, typography } from "app/theme"
import { Dimensions, ViewStyle, ImageStyle, TextStyle } from "react-native"
import * as Device from "expo-device"

export const screenWidth = Dimensions.get("window").width

export const $contentContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
}
export const APPLE = 0.6
export const ANDROID = 0.8

export const $imageStyle: ImageStyle = {
  width: Device.brand === "Apple" ? screenWidth * APPLE : screenWidth * ANDROID, // Scales image width to 80% of the screen width
  height: Device.brand === "Apple" ? screenWidth * APPLE : screenWidth * ANDROID, // Keeps the height proportional to avoid stretching
  alignSelf: "center",
  marginBottom: spacing.lg, // Adds some space below the image
}

export const $bodyStyle: TextStyle = {
  textAlign: "center",
  marginVertical: spacing.sm,
  fontFamily: typography.Poppins.mediumItalic,
}

export const $toggleAndButtonContainer: ViewStyle = {
  width: "80%",
  marginLeft: "auto",
  marginRight: "auto",
  marginVertical: spacing.sm,
}

export const $toggleContainerStyle: ViewStyle = {
  marginBottom: spacing.lg,
}
