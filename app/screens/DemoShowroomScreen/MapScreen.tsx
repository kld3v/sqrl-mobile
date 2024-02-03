import React, { FC, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"

import { ListItem, Screen, Text } from "../../components"

import { DemoTabScreenProps } from "../../navigators/DemoNavigator"
import { StatusBar } from "expo-status-bar"
import { spacing } from "app/theme"
import { openLinkInBrowser } from "app/utils/openLinkInBrowser"
import { isRTL } from "app/i18n"

export const MapScreen: FC<DemoTabScreenProps<"Map">> = function MapScreen(_props) {
  return (
    <>
      <StatusBar style="light" />
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
        <Text preset="heading" tx="mapScreen.title" style={$title} />
        <Text tx="mapScreen.tagLine" style={$tagline} />

        <Text preset="subheading" tx="mapScreen.hireUsTitle" style={$sectionTitle} />
        <Text tx="mapScreen.hireUs" style={$description} />
        <ListItem
          tx="mapScreen.hireUsLink"
          leftIcon="clap"
          rightIcon={isRTL ? "caretLeft" : "caretRight"}
          onPress={() =>
            openLinkInBrowser(
              "https://www.google.com/maps/place/Lone+Pine+Koala+Sanctuary/@-27.5337818,152.9662401,17z/data=!3m1!4b1!4m6!3m5!1s0x6b91502b5bff92a3:0xd95a4342ea4d7936!8m2!3d-27.5337818!4d152.968815!16zL20vMDdsbHAw?entry=ttu",
            )
          }
        />
      </Screen>
    </>
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
