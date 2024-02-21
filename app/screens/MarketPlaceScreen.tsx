import React, { FC, useState } from "react"
import { ImageStyle, TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { AutoImage, IsThisSomethingYouWouldUse, Screen, Text } from "../components"
import { colors, spacing } from "../theme"
// import { isRTL } from "../i18n"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"

interface MarketPlaceScreenProps extends AppStackScreenProps<"MarketPlace"> {}

export const MarketPlaceScreen: FC<MarketPlaceScreenProps> = observer(function MarketPlaceScreen() {
  const [Roger, setRoger] = useState(false)
  const maxHeightWidth = 160

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <StatusBar style="light" />
      <Text preset="heading" tx="marketPlaceScreen.title" style={$title} />
      <Text tx="marketPlaceScreen.tagLine" style={$tagline} />
      <Text preset="subheading" text="Scan, Earn, Spend" style={$sectionTitle} />
      <Text tx="marketPlaceScreen.description" style={$description} />

      <IsThisSomethingYouWouldUse questionID={2} />

      <TouchableOpacity onPress={() => setRoger(!Roger)}>
        {Roger ? (
          <AutoImage
            source={require("../../assets/images/vibe.gif")}
            style={$roger}
            accessibilityLabel="Roger"
            maxHeight={maxHeightWidth}
            maxWidth={maxHeightWidth}
          />
        ) : (
          <AutoImage
            maxHeight={maxHeightWidth}
            maxWidth={maxHeightWidth}
            source={require("../../assets/images/winkface.png")}
            style={$roger}
            accessibilityLabel="QRLA Logo - Wink Face"
          />
        )}
      </TouchableOpacity>

      {/* <ListItem
        tx="communityScreen.interweb"
        leftIcon="face"
        leftIconColor={colors.icon}
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://qrla.io")}
      /> */}
    </Screen>
  )
})

const baseTextStyle: TextStyle = {
  textAlign: "center",
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  justifyContent: "center",
  alignItems: "center",
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
  fontFamily: "Borsok",
  fontSize: 40,
  lineHeight: 56,
  ...baseTextStyle,
}

const $tagline: TextStyle = {
  marginBottom: spacing.sm,
  paddingTop: spacing.xxs,
  fontFamily: "Poppins",
  color: colors.textGreen,
  fontSize: 24,
  ...baseTextStyle,
}

// Scan and Compete
const $sectionTitle: TextStyle = {
  paddingTop: spacing.sm,
  marginBottom: spacing.sm,
  fontFamily: "PoppinsBold",
  fontSize: 32,
  ...baseTextStyle,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
  color: colors.textGreen,
  fontSize: 20,
  paddingHorizontal: spacing.lg,
  fontFamily: "Poppins",
  ...baseTextStyle,
}

const $roger: ImageStyle = {
  width: 120,
  height: 120,
  marginBottom: spacing.lg,
}
