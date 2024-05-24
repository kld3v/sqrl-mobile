import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { spacing } from "app/theme"

import Leaf from "./Svg/Leaf"
import { LeafFallAnimation } from "./LeafFallAnimation"
import { ScoreIncreaseAnimationText } from "./ScoreIncreaseAnimationText"
import * as Device from "expo-device"
export interface ScanScreenScoreProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}
const marginTop = Device.brand === "Apple" ? -8 : 0

/**
 * Describe your component here
 */
export const ScanScreenScore = observer(function ScanScreenScore(props: ScanScreenScoreProps) {
  console.log("rerender scan screen score")
  return (
    <View
      style={{
        width: "100%",
        // backgroundColor: "blue",
        position: "absolute",
        zIndex: 3,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        top: spacing.xl,
      }}
    >
      <LeafFallAnimation
        style={{
          position: "absolute",
          bottom: 10,
        }}
      />
      <ScoreIncreaseAnimationText />
      <Leaf
        style={{
          transform: [{ scale: 1.4 }],
          marginLeft: 6,
          marginTop,
        }}
      />
    </View>
  )
})
