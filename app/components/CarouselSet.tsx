import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Dimensions } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import Carousel from "react-native-reanimated-carousel"
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from "react-native-reanimated"
export interface CarouselSetProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const CarouselSet = observer(function CarouselSet(props: CarouselSetProps) {
  const { style } = props
  const $styles = [$container, style]
  const width = Dimensions.get("window").width
  const height = Dimensions.get("window").height

  return (
    <View style={$styles}>
      <Carousel
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.8,
          parallaxScrollingOffset: 75,
        }}
        width={width}
        height={height / 1.2}
        data={[...new Array(4).keys()]}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,

              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 24,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 30 }}>{index}</Text>
          </View>
        )}
      />
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
