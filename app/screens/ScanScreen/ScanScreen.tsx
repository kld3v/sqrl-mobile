import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ViewStyle } from "react-native"

import { QrVenueNotificationsManager, QrScanner, Screen } from "../../components"

import { TabScreenProps } from "../../navigators/Navigator"
import CameraPermissionDenied from "./CameraPermissionDenied"
import { useCameraPermissions } from "expo-camera/next"

export const ScanScreen: FC<TabScreenProps<"Scan">> = observer(function ScanScreen(_props) {
  const [permission, requestPermission] = useCameraPermissions()

  useEffect(() => {
    // Request permission if it hasn't been determined yet
    if (!permission) {
      requestPermission()
    }
  }, [permission, permission?.status])

  // Decide what to render based on the camera permission status
  const content = permission?.granted ? <QrScanner /> : <CameraPermissionDenied />

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      {content}
      <QrVenueNotificationsManager />
    </Screen>
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

// #endregion
