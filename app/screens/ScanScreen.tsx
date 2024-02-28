import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle } from "react-native"

import { QrVenueNotificationsManager, QrScanner, Screen } from "../components"

import { TabScreenProps } from "../navigators/Navigator"

export const ScanScreen: FC<TabScreenProps<"Scan">> = observer(function ScanScreen(_props) {
  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
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
