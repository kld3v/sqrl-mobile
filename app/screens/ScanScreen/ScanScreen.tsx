import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle } from "react-native"

import { QrVenueNotificationsManager, QrScanner, Screen } from "../../components"

import { TabScreenProps } from "../../navigators/Navigator"
import CameraPermissionDenied from "./CameraPermissionDenied"
import { useCameraPermissions } from "expo-camera/next"
// import { useCameraPermission } from "react-native-vision-camera"

export const ScanScreen: FC<TabScreenProps<"Scan">> = observer(function ScanScreen(_props) {
  // const { hasPermission, requestPermission } = useCameraPermission()

  const [status, requestPermission] = useCameraPermissions()

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      {/* {!hasPermission ? (
        <CameraPermissionDenied requestPermission={requestPermission} />
      ) : (
        <QrScanner />
      )} */}
      {status && status.granted ? (
        <QrScanner />
      ) : (
        <CameraPermissionDenied requestPermission={requestPermission} />
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
