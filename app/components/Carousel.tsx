import * as React from "react"
import { Dimensions, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Card } from "./Card"
import { AutoImage } from "./AutoImage"
import { useEffect } from "react"

export interface CarouselProps {
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode[]
}

/**
 * A generic carousel component which is essentially a set of state controlled cards.
 * Pass an array of ReactNode to the children prop for each new piece of content.
 * @MajidrNEO1879 Please stick to the interface. I'm watching you.
 */
export const Carousel = observer(function Carousel(props: CarouselProps) {
  const { style, children } = props
  const $styles = [$container, style]
  const width = Dimensions.get("window").width
  const height = Dimensions.get("window").height

  useEffect(() => {}, [])

  return (
    <View style={$styles}>
      <Card
        verticalAlignment="space-between"
        style={{
          width: width - 40,
          height: height - 108,
          padding: spacing.xl,
        }}
        heading="skip"
        headingStyle={{
          color: colors.textLightBg,
          fontSize: typography.fontSizes.body1,
          fontFamily: typography.Poppins.medium,
        }}
        childStyle={{}}
        contentStyle={{ color: colors.textLightBg }}
        footer="next"
        footerStyle={{
          color: colors.textLightBg,
          fontFamily: typography.Poppins.medium,
          alignSelf: "flex-end",
          fontSize: typography.fontSizes.body1,
        }}
      >
        <AutoImage
          source={require("../../assets/images/onBoardingImages/checking.jpeg")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </Card>
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
