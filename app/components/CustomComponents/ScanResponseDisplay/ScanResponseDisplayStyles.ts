import { colors, spacing } from "app/theme"
import { Dimensions, ViewStyle, ImageStyle, TextStyle } from "react-native"

export const $safeText = {
  color: colors.palette.primary500,
}
export const $unsafeText = {
  color: colors.palette.angry100,
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
  bottom: -62,
  right: -62,
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
export const $infoBoxCustom: TextStyle = {
  minWidth: 200,
  maxWidth: "100%",
  paddingHorizontal: 32,
  paddingVertical: spacing.md,
  borderRadius: 28,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}

export const $infoBoxTopWithMessage: TextStyle = {
  ...$infoBoxCustomBg,
  ...$infoBoxCustom,
  paddingHorizontal: spacing.xxxl,
  paddingVertical: spacing.lg,
}

export const $infoBoxPositioningContainer: ViewStyle = {
  zIndex: 99,
  position: "absolute",
  bottom: spacing.xxxl,
  height: 100,
  width: "100%",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}

export const $koalaGif: ImageStyle = {
  width: 60,
  height: 40,
  transform: [{ scale: 1.5 }],
}
