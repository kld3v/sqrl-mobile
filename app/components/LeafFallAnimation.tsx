import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import LottieView from "lottie-react-native"
import { useEffect, useRef } from "react"
import { useStores } from "app/models"
import { assetService } from "app/services/Assets/AssetService"

export interface LeafFallAnimationProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const LeafFallAnimation = observer(function LeafFallAnimation(
  props: LeafFallAnimationProps,
) {
  const { style } = props
  const $styles = [$container, style]
  const animation = useRef<LottieView>(null)
  const { leaderboardStore } = useStores()

  useEffect(() => {
    animation.current?.reset()
    animation.current?.play()

    // animation.current?.pause()
  }, [leaderboardStore.userScore])

  return (
    <View style={$styles}>
      <LottieView
        loop={false}
        ref={animation}
        speed={1.2}
        style={{
          width: 400,
          height: 400,
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={assetService.leafFallAnimation}
      />
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
