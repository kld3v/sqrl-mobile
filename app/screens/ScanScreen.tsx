import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ViewStyle } from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
// import Animated, {
//   Extrapolate,
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated"
import { Screen } from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"

import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"

const ICON_SIZE = 14

export const ScanScreen: FC<DemoTabScreenProps<"Scan">> = observer(function ScanScreen(_props) {
  const { episodeStore } = useStores()

  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await episodeStore.fetchEpisodes()
      setIsLoading(false)
    })()
  }, [episodeStore])

  // Might be useful for pull to refresh and to delay api request.
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([episodeStore.fetchEpisodes(), delay(750)])
    setRefreshing(false)
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={$screenContentContainer}
    ></Screen>
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

// #endregion
