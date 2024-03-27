import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { View, ViewStyle } from "react-native"
import { Carousel, Icon, ScanScreenScore, Text } from "../../components"

import { QrScanner, Screen } from "../../components"

import { TabScreenProps } from "../../navigators/MainNavigator"
import CameraPermissionDenied from "./CameraPermissionDenied"
import { useCameraPermissions } from "expo-camera/next"
import CameraPermissionUndetermined from "./CamerPermissionUndetermined"
import { $informationIcon } from "app/components/CustomComponents/QrScanner/QrScannerStyles"
import { colors, spacing } from "app/theme"
import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
import useOnboarding from "app/components/CustomComponents/QrScanner/useOnboarding"
import QrlaButton from "app/components/CustomComponents/QrScanner/QrlaButton"

export const ScanScreen: FC<TabScreenProps<"Scan">> = observer(function ScanScreen(_props) {
  const [permission, requestPermission] = useCameraPermissions()
  const { onboardingStore, leaderboardStore } = useStores()
  const navigation = useNavigation()
  useOnboarding()

  useEffect(() => {
    // Request permission if it hasn't been determined yet
    if (!permission) {
      requestPermission()
    }
  }, [permission, permission?.status])

  useEffect(() => {
    ;(async () => {
      await leaderboardStore.setUserScoreFromSecureStorage()
    })()
  }, [])

  // Decide what to render based on the camera permission status
  const content = permission?.granted ? (
    <QrScanner />
  ) : permission?.status === "undetermined" ? (
    <CameraPermissionUndetermined />
  ) : (
    <CameraPermissionDenied />
  )

  console.log(leaderboardStore.userScore, "leaderboardStore")
  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      <ScanScreenScore />
      <QrlaButton />
      {!onboardingStore.hasOnboarded && (
        <Carousel
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 5,
          }}
        />
      )}
      <Icon
        icon="information"
        color={colors.palette.primary300}
        containerStyle={$informationIcon}
        size={32}
        // @ts-ignore
        onPress={() => navigation.navigate("Information")}
      />
      {content}
    </Screen>
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

// #endregion
