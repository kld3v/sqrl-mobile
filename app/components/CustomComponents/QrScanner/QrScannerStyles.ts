import { colors, spacing } from "app/theme"
import { TextStyle, ViewStyle } from "react-native"

export const $container: ViewStyle = {
  flex: 1,
}

export const $qrlaButton: ViewStyle = {
  margin: spacing.md,
  zIndex: 99,
  position: "absolute",
  top: 0,
  right: 0,
}

export const $camera: ViewStyle = {
  flex: 1,
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: 1,
}

export const $reticle: ViewStyle = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 200,
  height: 200,
  marginLeft: -100, // half of width to center
  marginTop: -100, // half of height to center
  zIndex: 3,
}

export const $subReticuleUrlStyle: TextStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  top: "68%",
  zIndex: 3,
  textAlign: "center",
}

export const $refresh: ViewStyle = {
  position: "absolute",
  bottom: 16,
  right: 16,
  zIndex: 999,
  shadowColor: "#000",
  shadowOffset: { width: 2, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
}

export const $card: TextStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
}
