import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { useStores } from "app/models"
import Leaf from "./Svg/Leaf"

export interface ScanScreenScoreProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const ScanScreenScore = observer(function ScanScreenScore(props: ScanScreenScoreProps) {
  const { leaderboardStore } = useStores()

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
      <Text
        style={{
          fontFamily: typography.fonts.borsok.normal,
          fontSize: typography.fontSizes.h4,
          paddingVertical: 4,
        }}
        text={leaderboardStore.score}
      />
      <Leaf
        style={{
          transform: [{ scale: 1.4 }],
          marginLeft: 6,
          marginTop: -6,
        }}
      />
    </View>
  )
})
