import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { useStores } from "app/models"

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
  const { style } = props
  const $styles = [$container, style]
  const { leaderboardStore } = useStores()

  return (
    <View style={$styles}>
      <View
        style={{
          width: "100%",
          // backgroundColor: "blue",
          position: "absolute",
          zIndex: 3,
          justifyContent: "center",
          alignItems: "center",
          top: spacing.xl,
        }}
      >
        <Text text={leaderboardStore.score} />
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
