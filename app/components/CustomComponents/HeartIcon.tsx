import React, { useCallback, useState } from "react"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated"
import { View, StyleSheet } from "react-native"
import { Icon } from "../Icon" // Ensure proper import path
import { colors } from "app/theme" // Ensure proper import path

const ICON_SIZE = 36

const HeartIcon: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const scale = useSharedValue(1)

  const handlePress = useCallback(() => {
    setIsFavorite(!isFavorite)
    // Heart animation
    scale.value = withSpring(isFavorite ? 1 : 1.2, { damping: 5, stiffness: 150 }, () => {
      scale.value = withSpring(1)
    })

    if (onPress) {
      onPress()
    }
  }, [isFavorite, onPress])

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.heartContainer, heartAnimatedStyle]}>
        <Icon
          onPress={handlePress}
          icon={isFavorite ? "heart" : "heart"}
          size={ICON_SIZE}
          color={isFavorite ? colors.palette.heartRed : colors.palette.neutral800}
        />
      </Animated.View>
    </View>
  )
}

export default HeartIcon

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  heartContainer: {
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
  sparkle: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "gold",
    borderRadius: 5,
    top: "50%",
    left: "50%",
  },
})
