import React, { FC, useState } from "react"
import { ImageStyle, TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { AutoImage, IsThisSomethingYouWouldUse, Screen, Text } from "../components"
import { TabScreenProps } from "../navigators/Navigator"
import { colors, spacing, typography } from "../theme"

// import { isRTL } from "../i18n"
import { StatusBar } from "expo-status-bar"

export const CommunityScreen: FC<TabScreenProps<"Community">> = function CommunityScreen(_props) {
  const [Roger, setRoger] = useState(false)
  const maxHeightWidth = 160

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <StatusBar style="light" />
      <Text preset="heading" tx="communityScreen.title" style={$title} />
      <Text tx="communityScreen.tagLine" style={$tagline} />
      <Text preset="subheading" text="Scan and Compete" style={$sectionTitle} />
      <Text tx="communityScreen.description" style={$description} />

      <IsThisSomethingYouWouldUse />

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
}

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
  fontSize: 48,
  lineHeight: 56,
  ...baseTextStyle,
}

const $tagline: TextStyle = {
  marginBottom: spacing.sm,
  paddingTop: spacing.xxs,
  fontFamily: "PoppinsSemiBold",
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
  fontFamily: typography.Poppins.normal,
  ...baseTextStyle,
}

const $roger: ImageStyle = {
  width: 120,
  height: 120,
  marginBottom: spacing.lg,
}
