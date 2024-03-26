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
  color: colors.palette.primary500,
  textAlign: "center",
  marginVertical: spacing.xl,
}

export const $hyperlink: TextStyle = {
  color: colors.palette.primary500,
  textDecorationLine: "underline",
  fontFamily: typography.Poppins.mediumItalic,
}
