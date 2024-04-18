import { spacing, colors, typography } from "app/theme"
import { TextStyle, ViewStyle } from "react-native"

export const $tableRowContainer: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  paddingVertical: spacing.sm,
  marginVertical: spacing.sm,
  alignItems: "center",
}

export const $userTableRow: ViewStyle = {
  ...$tableRowContainer,
  backgroundColor: colors.scannerInfoBox,
  borderRadius: 16,
}

export const $tableHeadStyle: TextStyle = {
  fontSize: 16,
  color: colors.palette.neutral100,
}

export const $tableRowUsernameAndIndexStyle: TextStyle = {
  fontFamily: typography.fonts.poppins.semiBold,
  fontSize: 20,
  color: colors.palette.neutral800,
}

export const $positionColStyle: TextStyle = {
  width: "16%",
  textAlign: "center",
}

export const $userNameColStyle: TextStyle = {
  width: "64%",
  flexDirection: "row",
  alignItems: "center",
}

export const $scoreColStyle: TextStyle = {
  textAlign: "center",
  width: "16%",
}
export const $scoreColContainer: ViewStyle = {
  ...$scoreColStyle,
  borderRadius: 30,
  borderColor: "#a3f632",
  borderWidth: 2,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  height: 40,
}

export const $scoreColEntryTextOnlyStyle: TextStyle = {
  fontFamily: typography.fonts.poppins.semiBold,
  color: "white",
  textAlign: "center",
}

export const $medalStyle = {
  transform: [{ scale: 1.6 }],
  marginLeft: 22,
  marginTop: 4,
}
