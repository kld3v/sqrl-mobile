import React, { FC, useState } from "react"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import {
  AutoImage,
  IsThisSomethingYouWouldUse,
  ListItem,
  Screen,
  Text,
  Toggle,
} from "../components"
import { TabScreenProps } from "../navigators/Navigator"
import { colors, spacing } from "../theme"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
// import { isRTL } from "../i18n"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"

interface MarketPlaceScreenProps extends AppStackScreenProps<"MarketPlace"> {}

export const MarketPlaceScreen: FC<MarketPlaceScreenProps> = observer(function MarketPlaceScreen() {
  const [Roger, setRoger] = useState(false)
  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <StatusBar style="light" />

      <Text preset="heading" text="Market Place" style={$title} />
      <Text text="Coming Soon..." style={$tagline} />

      <Text preset="subheading" text="Scan, Earn, Spend" style={$sectionTitle} />
      <Text tx="marketPlaceScreen.description" style={$description} />

      <IsThisSomethingYouWouldUse />

      <TouchableOpacity onPress={() => setRoger(!Roger)}>
        {Roger ? (
          <AutoImage
            source={require("../../assets/images/vibe.gif")}
            style={$roger}
            accessibilityLabel="Roger"
          />
        ) : (
          <AutoImage
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
