import { TextStyle, ViewStyle } from "react-native"
import { colors } from "./colors"
import { typography } from "./typography"
import { spacing } from "./spacing"

export const $rootScreen: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.md,
}

export const $title: TextStyle = {
  color: colors.palette.primary500,
  textAlign: "center",
  marginBottom: spacing.xs,
}

export const $hyperlink: TextStyle = {
  color: colors.palette.primary500,
  textDecorationLine: "underline",
  fontFamily: typography.Poppins.mediumItalic,
}
