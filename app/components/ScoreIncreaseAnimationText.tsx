import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { useEffect, useState } from "react"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated"
import { useStores } from "app/models"
import * as Haptics from "expo-haptics"

export interface ScoreIncreaseAnimationTextProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const ScoreIncreaseAnimationText = observer(function ScoreIncreaseAnimationText(
  props: ScoreIncreaseAnimationTextProps,
) {
  const { style } = props
  const $styles = [$container, style]
  const { leaderboardStore } = useStores()

  // This value is used to control the scale of the text
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })
  const [score, setScore] = useState("")
  useEffect(() => {
    // Sequence to gently grow, wobble, and shrink back, with an initial delay
    scale.value = withDelay(
      3000, // Delay in milliseconds
      withSequence(
        withTiming(1.1, { duration: 600, easing: Easing.elastic(1) }), // Gently grow
        withTiming(0.95, { duration: 150, easing: Easing.elastic(1) }), // Wobble (shrink)
        withTiming(1.25, { duration: 150, easing: Easing.elastic(1) }), // Wobble (grow)
        withTiming(1, { duration: 600, easing: Easing.elastic(1) }), // Return to normal smoothly
      ),
    )

    // If someone's looking over this in my absence, well je ne regrette rien.
    ;(() => {
      new Promise((resolve) => {
        setTimeout(() => resolve(leaderboardStore.userScore), 3300)
      }).then((score) => {
        setScore(score as string)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      })
    })()
  }, [leaderboardStore.userScore]) // Depend on userScore to re-trigger the animation when it changes

  useEffect(() => {
    setScore(leaderboardStore.userScore)
  }, [])

  return (
    <>
      <Animated.Text
        style={[
          {
            fontFamily: typography.fonts.borsok.normal,
            fontSize: typography.fontSizes.h4,
            paddingVertical: 5,
            color: "white",
          },
          animatedStyle,
        ]}
      >
        {score}
      </Animated.Text>
    </>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
