import React, { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { ListItem, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
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

      <Text preset="subheading" tx="communityScreen.hireUsTitle" style={$sectionTitle} />
      <Text tx="communityScreen.hireUs" style={$description} />
      <ListItem
        tx="communityScreen.hireUsLink"
        leftIcon="clap"
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
  marginBottom: spacing.xxl,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
}

const $sectionTitle: TextStyle = {
  marginTop: spacing.xxl,
}
