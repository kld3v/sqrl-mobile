import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle } from "react-native"

import { QrVenueNotificationsManager, QrScanner, Screen } from "../components"

import { TabScreenProps } from "../navigators/Navigator"
import { StatusBar } from "expo-status-bar"

export const ScanScreen: FC<TabScreenProps<"Scan">> = observer(function ScanScreen(_props) {
  return (
    <Screen preset="auto" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      <StatusBar style="light" />
      <QrScanner />
      <QrVenueNotificationsManager />
    </Screen>
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

// #endregion
