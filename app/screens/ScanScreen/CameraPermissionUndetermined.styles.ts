import { colors, spacing } from "app/theme"
import { TextStyle, ViewStyle } from "react-native"

export const $container: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

export const $title: TextStyle = {
  marginTop: spacing.xxl,
  marginBottom: spacing.sm,
  fontFamily: "Borsok",
  color: colors.palette.primary500,
}
