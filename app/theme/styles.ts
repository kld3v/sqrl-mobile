import { TextStyle, ViewStyle } from "react-native"
import { colors } from "./colors"
import { typography } from "./typography"
import { spacing } from "./spacing"

export const $rootScreen: ViewStyle = {
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.md,
  width: "100%",
  height: "100%",
}

export const $title: TextStyle = {
  fontFamily: typography.fonts.borsok.normal,
  fontSize: typography.fontSizes.h1,
  color: colors.palette.primary500,
  textAlign: "center",
  paddingVertical: spacing.md,
}

export const $hyperlink: TextStyle = {
  color: colors.palette.primary500,
  // textDecorationLine: "underline",
  fontFamily: typography.Poppins.medium,
}

export const $termsHyperlink: TextStyle = {
  color: colors.palette.primary500,
  // textDecorationLine: "underline",
  fontFamily: typography.Poppins.medium,
}

export const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}
