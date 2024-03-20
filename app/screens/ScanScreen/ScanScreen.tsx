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
    if (permission && permission.status !== "granted") {
      requestPermission()
    }
  }, [])

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      {permission && permission.status === "granted" ? (
        <QrScanner />
      ) : (
        <CameraPermissionDenied
          requestPermission={requestPermission}
          permissionStatus={permission?.status}
        />
      )}
      <QrVenueNotificationsManager />
    </Screen>
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

// #endregion
