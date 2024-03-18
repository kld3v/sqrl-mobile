import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Dimensions } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import Carousel from "react-native-reanimated-carousel"
export interface MultiCardCarouselProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const MultiCardCarousel = observer(function MultiCardCarousel(
  props: MultiCardCarouselProps,
) {
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
          parallaxAdjacentItemScale: 0.4,
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
            <Text
              style={{
                textAlign: "center",
                fontSize: 30,
                color: "black",

                padding: 10,
              }}
            >
              {index}
            </Text>
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
