import { colors, spacing } from "app/theme"
import { Dimensions, ViewStyle, ImageStyle, TextStyle } from "react-native"

export const $safeText = {
  color: colors.palette.primary500,
}
export const $unsafeText: TextStyle = {
  color: colors.palette.angry100,
  paddingHorizontal: spacing.md,
  textAlign: "center",
}

export const screenHeight = Dimensions.get("window").height
export const messageBoxPosition = screenHeight * 0.05

export const $messageBoxContainer: ViewStyle = {
  zIndex: 99,
  marginTop: messageBoxPosition,
  width: "100%",
  height: 200,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  transform: [{ scale: 0.8 }],
}

export const $messageBoxIcon: ImageStyle = {
  position: "absolute",
  bottom: -30,
  right: -28,
  transform: [{ scale: 1.2 }],
}

export const $standardShadow: any = {
  shadowColor: "#000",
  shadowOffset: { width: 2, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
}
export const $infoBoxCustomBg: TextStyle = {
  backgroundColor: colors.scannerInfoBox,
  borderWidth: 4,
}

const width = Dimensions.get("screen").width
export const $infoBoxCustom: TextStyle = {
  minWidth: width,
  // maxWidth: "100%",
  // paddingHorizontal: 32,
  paddingVertical: spacing.xxl,
  borderRadius: 28,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  // backgroundColor: "blue",
}

export const $infoBoxTopWithMessage: TextStyle = {
  ...$infoBoxCustomBg,
  ...$infoBoxCustom,
  // paddingHorizontal: spacing.xxl,
  paddingVertical: spacing.lg,
}

export const $infoBoxPositioningContainer: ViewStyle = {
  zIndex: 99,
  position: "absolute",
  bottom: spacing.xxl,
  height: 40,
  width: "100%",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  // backgroundColor: "red",
}

export const $koalaGif: ImageStyle = {
  width: 60,
  height: 40,
  transform: [{ scale: 1.5 }],
}
