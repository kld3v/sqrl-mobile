import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { ScanStateOptions } from "types"
import { ReticuleCorner } from "./ReticuleCorner"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { useEffect } from "react"
export interface ReticuleProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  scanning: boolean
  safe: boolean
  scanState: ScanStateOptions
}

export const Reticule = observer(function Reticule(props: ReticuleProps) {
  const { style, safe, scanState, scanning } = props
  const $styles = [$container, style]

  // Shared value for rotation
  const rotation = useSharedValue(0)

  // Animated style for rotating the reticule
  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    }
  })
  useEffect(() => {
    if (scanning) {
      // Rotate 360 degrees indefinitely
      rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false)
    } else {
      // Reset rotation if not scanning
      rotation.value = withTiming(0, { duration: 0 })
    }
  }, [scanning, rotation])

  return (
    <>
      <Animated.View style={[$styles, rotateStyle]}>
        <ReticuleCorner scanState={scanState} position="TopLeft" scanning={scanning} safe={safe} />
        <ReticuleCorner scanState={scanState} position="TopRight" scanning={scanning} safe={safe} />
        <ReticuleCorner
          scanState={scanState}
          position="BottomLeft"
          scanning={scanning}
          safe={safe}
        />
        <ReticuleCorner
          scanState={scanState}
          position="BottomRight"
          scanning={scanning}
          safe={safe}
        />
      </Animated.View>
    </>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
