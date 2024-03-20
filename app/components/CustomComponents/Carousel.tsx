import * as React from "react"
import { Dimensions, Pressable, StyleProp, View, ViewStyle, Image } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Card } from "../Card"
import { Text } from "../Text"
import useOnboardingCarousel from "./QrScanner/useOnboardingCarousel"

export interface CarouselProps {
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode[]
}

/**
 * A generic carousel component which is essentially a set of state controlled cards.
 * Pass an array of ReactNode to the children prop for each new piece of content.
 * @MajidrNEO1879 Please stick to the interface. I'm watching you.
 *
 * Todo Refactor this into a generic component that takes the content as an array via children. @kolyad3v
 */
export const Carousel = observer(function Carousel(props: CarouselProps) {
  const { style, children } = props
  const $styles = [$container, style]
  const { width, height } = Dimensions.get("window")
  const { currentImageIndex, images, text, onNextPress, onBackPress, onFinishedOnboardingPress } =
    useOnboardingCarousel()
  const hitSlopFactor = { top: 10, bottom: 10, left: 10, right: 10 }
  return (
    <View style={$styles}>
      <Card
        // verticalAlignment="space-between"
        style={{
          width: width - 40,
          height: height - 108,
          padding: spacing.lg,
        }}
        HeadingComponent={
          <Pressable hitSlop={hitSlopFactor} onPress={onFinishedOnboardingPress}>
            <Text text="Skip" style={{ color: colors.textLightBgButton }} />
          </Pressable>
        }
        ContentComponent={
          <Text
            text={text[currentImageIndex]}
            style={{
              fontSize: typography.fontSizes.h5,
              fontFamily: typography.Poppins.bold,
              color: colors.textLightBg,
              textAlign: "center",
              marginTop: 20,
            }}
          />
        }
        FooterComponent={
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {[...Array(images.length)].map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 8,
                    marginHorizontal: 4,
                    backgroundColor:
                      index === currentImageIndex ? colors.textGreen : colors.background,
                    borderWidth: 4, // Add border width
                    borderColor: colors.background, // Add border color
                  }}
                />
              ))}
            </View>

            <View
              style={{
                // position: "relative",
                flexDirection: "row",
                justifyContent: currentImageIndex !== 0 ? "space-between" : "flex-end",
                // alignItems: "center",

                width: "100%",
              }}
            >
              {currentImageIndex !== 0 && (
                <Pressable hitSlop={hitSlopFactor} onPress={onBackPress}>
                  <Text text="Back" style={{ color: colors.textLightBgButton }} />
                </Pressable>
              )}

              {currentImageIndex === images.length - 1 ? (
                <Pressable hitSlop={hitSlopFactor} onPress={onFinishedOnboardingPress}>
                  <Text text="Start" style={{ color: colors.textLightBgButton }} />
                </Pressable>
              ) : (
                <Pressable hitSlop={hitSlopFactor} onPress={onNextPress}>
                  <Text text="Next" style={{ color: colors.textLightBgButton }} />
                </Pressable>
              )}
            </View>
          </>
        }
      >
        <Image
          source={images[currentImageIndex]}
          style={{ flex: 1, width: "100%", maxHeight: "100%" }}
          resizeMode="contain"
        />
      </Card>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
