import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"
import {
  AutoImage,
  Carousel,
  Icon,
  ListItem,
  QrVenueNotificationsManager,
  ScanScreenScore,
} from "../../components"

import { QrScanner, Screen } from "../../components"

import { TabScreenProps } from "../../navigators/MainNavigator"
import CameraPermissionDenied from "./CameraPermissionDenied"
import { useCameraPermissions } from "expo-camera"
import CameraPermissionUndetermined from "./CamerPermissionUndetermined"
import { $informationIcon } from "app/components/CustomComponents/QrScanner/QrScannerStyles"
import { colors, spacing } from "app/theme"
import { useStores } from "app/models"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import useOnboarding from "app/components/CustomComponents/QrScanner/useOnboarding"
import QrlaButton from "app/components/CustomComponents/QrScanner/QrlaButton"
import useCustomSwiper from "app/utils/useCustomSwiper"
import { PanGestureHandler } from "react-native-gesture-handler"
import { Drawer } from "react-native-drawer-layout"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { assetService } from "app/services/Assets/AssetService"
import { LinearGradient } from "expo-linear-gradient"

export const ScanScreen: FC<TabScreenProps<"Scan">> = observer(function ScanScreen(_props) {
  const [permission, requestPermission] = useCameraPermissions()
  const { onboardingStore, leaderboardStore } = useStores()
  const navigation = useNavigation()
  useOnboarding()
  const { onSwipeEvent } = useCustomSwiper({
    onSwipeLeft: () => navigation.navigate("Leaderboard"),
    onSwipeRight: () => navigation.navigate("History"),
  })
  const [open, setOpen] = useState(false)
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

  useFocusEffect(
    React.useCallback(() => {
      setOpen(false) // Closes the drawer whenever the screen is focused

      return () => {
        // Optional: Anything you might want to reset when the screen blurs
      }
    }, []),
  )

  // Decide what to render based on the camera permission status
  const content = permission?.granted ? (
    <QrScanner />
  ) : permission?.status === "undetermined" ? (
    <CameraPermissionUndetermined />
  ) : (
    <CameraPermissionDenied />
  )

  const $drawerInsets = useSafeAreaInsetsStyle(["top"])

  const toggleDrawer = () => {
    if (!open) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType={"slide"}
      renderDrawerContent={() => (
        <View style={[$drawer, $drawerInsets]}>
          <LinearGradient
            // Background Linear Gradient
            colors={["transparent", colors.palette.overlay50]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "110%",
            }}
          />
          <View style={$logoContainer}>
            <AutoImage
              style={{
                height: 56,
                width: 56,
              }}
              source={assetService.qrlaLogo}
              resizeMode="contain"
            />
            <ListItem
              style={{ marginTop: spacing.md }}
              text="Profile"
              onPress={() => navigation.navigate("Profile")}
              rightIcon="caretRight"
              rightIconColor="white"
            />
            <ListItem
              text="Help"
              onPress={() => navigation.navigate("Information")}
              rightIcon="caretRight"
              rightIconColor="white"
            />
          </View>
        </View>
      )}
    >
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <PanGestureHandler onHandlerStateChange={onSwipeEvent}>
          <View style={$screenContentContainer}>
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
              icon="menu"
              color={colors.palette.primary300}
              containerStyle={$informationIcon}
              size={40}
              // @ts-ignore
              onPress={toggleDrawer}
            />
            {content}
          </View>
        </PanGestureHandler>
      </Screen>
      <QrVenueNotificationsManager />
    </Drawer>
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
}

const $logoContainer: ViewStyle = {
  height: 56,

  width: "80%",
  marginTop: spacing.xl,
  marginLeft: spacing.xl,
}

// #endregion
