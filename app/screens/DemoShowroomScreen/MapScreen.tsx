import React, { FC, useState } from "react"
import { ImageStyle, TextStyle, ViewStyle } from "react-native"

import { Icon, ListItem, Screen, Text } from "../../components"

import { DemoTabScreenProps } from "../../navigators/DemoNavigator"
import { StatusBar } from "expo-status-bar"
import { colors, spacing } from "app/theme"
import { openLinkInBrowser } from "app/utils/openLinkInBrowser"
import { isRTL } from "app/i18n"

export const MapScreen: FC<DemoTabScreenProps<"Map">> = function MapScreen(_props) {
  return (
    <>
      <StatusBar style="light" />
      <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
        <Text preset="heading" tx="mapScreen.title" style={$title} />
        <Text tx="mapScreen.tagLine" style={$tagline} />
        <Text preset="subheading" tx="mapScreen.weLikeLeaves" style={$sectionTitle} />
        <Icon icon="eucalyptus" color={colors.icon} size={30} style={$eucalyptus} />
        <Icon
          icon="map"
          color={colors.icon}
          size={240}
          style={$map}
          onPress={() =>
            openLinkInBrowser(
              "https://www.google.com/maps/place/Lone+Pine+Koala+Sanctuary/@-27.5337818,152.9662401,17z/data=!3m1!4b1!4m6!3m5!1s0x6b91502b5bff92a3:0xd95a4342ea4d7936!8m2!3d-27.5337818!4d152.968815!16zL20vMDdsbHAw?entry=ttu",
            )
          }
        />
        <ListItem
          tx="mapScreen.headquarters"
          leftIcon="face"
          leftIconColor={colors.icon}
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
  marginBottom: spacing.sm,
}

const $sectionTitle: TextStyle = {
  marginTop: spacing.lg,
}

const $map: ImageStyle = {
  marginTop: spacing.sm,
  marginBottom: spacing.sm,
}

const $eucalyptus: ImageStyle = {
  marginBottom: spacing.sm,
}
