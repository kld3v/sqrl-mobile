import * as React from "react"
import { ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { colors } from "app/theme"

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { useEffect } from "react"
import { ReticleProps } from "./Reticle"

export interface ReticleCornerProps extends ReticleProps {
  position: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight"
}

/**
 * Describe your component here
 */
export const ReticleCorner = observer(function ReticleCorner(props: ReticleCornerProps) {
  const { position, scanning, safe, scanState } = props

  // Distance to move closer. Adjust the value as needed.
  const moveDistance = useSharedValue(0)

  // Animated style for moving closer
  const moveStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // Example for TopLeft corner. Adjust translation for other corners accordingly.
        { translateX: position.includes("Left") ? moveDistance.value : -moveDistance.value },
        { translateY: position.includes("Top") ? moveDistance.value : -moveDistance.value },
      ],
    }
  })

  useEffect(() => {
    if (scanning) {
      // First, move the corners closer
      moveDistance.value = withTiming(50, { duration: 500 }) // Adjust target value and duration as needed
    } else {
      // Reset animation if not scanning
      moveDistance.value = withTiming(0, { duration: 500 })
    }
  }, [scanning, moveDistance])

  return (
    <Animated.View
      style={[
        moveStyle,
        styles[`corner${position}`],
        scanning && $scanningCorner,
        scanState === "scanned" ? (safe ? $scannedSafe : $scannedUnsafe) : null,
        scanning ? styles[`corner${position}Animating`] : {},
      ]}
    ></Animated.View>
  )
})

const $scanningCorner: ViewStyle = {
  borderColor: colors.palette.neutral100,
}

const $scannedSafe: ViewStyle = {
  borderColor: colors.palette.primary500,
}

const $scannedUnsafe: ViewStyle = {
  borderColor: colors.palette.angry500,
}

const styles = StyleSheet.create({
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderColor: "white",
    borderTopLeftRadius: 10,
  },
  cornerTopLeftAnimating: {
    borderColor: colors.palette.neutral600,
  },
  cornerTopRightAnimating: {
    borderColor: colors.palette.neutral600,
  },
  cornerBottomLeftAnimating: {
    borderColor: colors.palette.neutral600,
  },
  cornerBottomRightAnimating: {
    borderColor: colors.palette.neutral600,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderColor: "white",
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderColor: "white",
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderColor: "white",
    borderBottomRightRadius: 10,
  },
})
