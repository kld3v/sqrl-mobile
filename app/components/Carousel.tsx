import * as React from "react"
import { Dimensions, Pressable, StyleProp, TextStyle, View, ViewStyle, Image } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Card } from "./Card"
import { AutoImage } from "./AutoImage"
import { useEffect, useState } from "react"
import { Text } from "./Text"
import { Asset } from "expo-asset"

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
  const { width, height } = Dimensions.get("window")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    require("../../assets/images/onBoardingImages/checking.jpeg"),
    require("../../assets/images/onBoardingImages/goodToGo.jpeg"),
    require("../../assets/images/onBoardingImages/eqr.jpeg"),
    require("../../assets/images/onBoardingImages/caution.jpeg"),
  ]

  const text = [
    "Hold the camera up to QR code for scanning.",
    "If the QR code is safe, go ahead to the destination by clicking on the proceed button.",
    "Skip scanning! Utilise our EQR feature for instant access to the right QR code at your location.",
    "If the QR code is flagged as dangerous, we advice against proceeding to the site.",
  ]

  const onNextPress = () => {
    // Increment the current image index, or loop back to the first image if at the end
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }
  const onBackPress = () => {
    // Decrement the current image index, or loop back to the last image if at the start
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const preloadImages = async () => {
    const imageAssets = images.map((image) => {
      return Asset.fromModule(image).downloadAsync()
    })
    await Promise.all(imageAssets)
  }

  useEffect(() => {
    preloadImages()
  }, [])

  return (
    <View style={$styles}>
      <Card
        verticalAlignment="space-between"
        style={{
          width: width - 40,
          height: height - 108,
          padding: spacing.xl,
        }}
        HeadingComponent={
          <Pressable>
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
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
            <Pressable onPress={onBackPress}>
              <Text text="Back" style={{ color: colors.textLightBgButton }} />
            </Pressable>
            {currentImageIndex === images.length - 1 ? (
              <Pressable onPress={onNextPress}>
                <Text text="Get Started" style={{ color: colors.textLightBgButton }} />
              </Pressable>
            ) : (
              <Pressable onPress={onNextPress}>
                <Text text="Next" style={{ color: colors.textLightBgButton }} />
              </Pressable>
            )}
          </View>
        }
      >
        <Image
          source={images[currentImageIndex]}
          style={{ flex: 1, maxWidth: "100%", maxHeight: "100%" }}
          resizeMode="contain"
        />
      </Card>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
