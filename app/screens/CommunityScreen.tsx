import React, { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { ListItem, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { isRTL } from "../i18n"
import { StatusBar } from "expo-status-bar"

export const CommunityScreen: FC<DemoTabScreenProps<"Community">> = function CommunityScreen(
  _props,
) {
  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <StatusBar style="light" />

      <Text preset="heading" tx="communityScreen.title" style={$title} />
      <Text tx="communityScreen.tagLine" style={$tagline} />

      <Text preset="subheading" tx="communityScreen.thisIsRoger" style={$sectionTitle} />
      <Image
        source={require("../../assets/images/vibe.gif")}
        style={$roger}
        accessibilityLabel="Roger"
      />

      <Text tx="communityScreen.hireUs" style={$description} />
      <ListItem
        tx="communityScreen.interweb"
        leftIcon="face"
        leftIconColor={colors.icon}
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://qrla.io")}
      />
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $tagline: TextStyle = {
  marginBottom: spacing.xs,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
}

const $sectionTitle: TextStyle = {
  marginTop: spacing.sm,
}

const $roger: ImageStyle = {
  width: 200,
  height: 200,
  marginBottom: spacing.lg,
}
