import React, { FC, useCallback } from "react"
import * as Application from "expo-application"
import { Linking, Platform, TextStyle, View, ViewStyle } from "react-native"
import { AutoImage, Button, ListItem, Screen, Text } from "../../components"
import { TabScreenProps } from "../../navigators/MainNavigator"
import { colors, spacing, typography } from "../../theme"
import { isRTL } from "../../i18n"
import { useStores } from "../../models"
import { observer } from "mobx-react-lite"
import { secureStoreInstance } from "app/services/SecureStore/SecureStorageService"
import * as Clipboard from "expo-clipboard"
import { qrScannerService } from "app/services/QrScanner"
import { pushNotificationService } from "app/services/PushNotifications"
import useOnboarding from "app/components/CustomComponents/QrScanner/useOnboarding"
import { historyService } from "app/services/History/HistoryService"
import { leaderboardServiceInstance } from "app/services/Leaderboard"
import { authService } from "app/services/Auth"

const copyToClipboard = async (message: any) => {
  await Clipboard.setStringAsync(message)
  alert("Copied to clipboard")
}

export const DebugScreen: FC<TabScreenProps<"Debug">> = observer(function DebugScreen(_props) {
  const {
    debugStore,
    locationStore: { longitude, latitude },
    pushNotificationsStore,
    onboardingStore,
    leaderboardStore,
    authenticationStore,
  } = useStores()

  useOnboarding()

  const usingHermes = typeof HermesInternal === "object" && HermesInternal !== null
  // @ts-expect-error
  const usingFabric = global.nativeFabricUIManager != null

  const demoReactotron = React.useMemo(
    () => async () => {
      if (__DEV__) {
        console.tron.display({
          name: "DISPLAY",
          value: {
            appId: Application.applicationId,
            appName: Application.applicationName,
            appVersion: Application.nativeApplicationVersion,
            appBuildVersion: Application.nativeBuildVersion,
            hermesEnabled: usingHermes,
          },
          important: true,
        })
      }
    },
    [],
  )

  const dummyApiTest_HTTPS_ApiSauce = useCallback(async () => {
    try {
      let response = await qrScannerService.sendUrlAndLocationData(
        "www.testingNewHttps_apiSauce.com",
        latitude,
        longitude,
      )
      debugStore.addInfoMessage(`dummyApiTest_HTTPS_ApiSauce: ${JSON.stringify(response)}`)
    } catch (error) {
      debugStore.addErrorMessage(`dummyApiTest_HTTPS_ApiSauce: ${JSON.stringify(error)}`)
    }
  }, [])

  const renderDebugStoreErrorMessages = useCallback(() => {
    return debugStore.errorMessages.map((message, index) => (
      <ListItem
        key={index}
        LeftComponent={
          <View style={$item}>
            <Text preset="bold" style={{ color: colors.palette.angry500 }}>
              Error {index + 1}
            </Text>
            <Text>{message}</Text>
            <Button
              style={$button}
              text="Copy to Clipboard"
              onPress={() => copyToClipboard(message)}
            />
          </View>
        }
      />
    ))
  }, [debugStore.errorMessages, copyToClipboard])

  const renderDebugStoreInfoMessages = useCallback(() => {
    return debugStore.infoMessages.map((message, index) => (
      <ListItem
        key={index}
        LeftComponent={
          <View style={$item}>
            <Text preset="bold" style={{ color: colors.palette.primary500 }}>
              Info {index + 1}
            </Text>
            <Text>{message}</Text>
            <Button
              style={$button}
              text="Copy to Clipboard"
              onPress={() => copyToClipboard(message)}
            />
          </View>
        }
      />
    ))
  }, [debugStore.infoMessages, copyToClipboard])

  const sendDummyPushNotification = useCallback(async () => {
    const expoPushToken = pushNotificationsStore.expoPushToken
    if (!expoPushToken) {
      debugStore.addErrorMessage(
        `sendDummyPushNotification: expoPushToken is not available or non-existant: ${expoPushToken}`,
      )
      return
    }

    try {
      await pushNotificationService.sendPushNotificationToUser(expoPushToken, {
        title: "Welcome to QRLA!",
        body: "Click to see the trusted QR Destination!",
        sound: "default",
        data: { url: "www.qrla.io" },
      })
    } catch (error) {
      debugStore.addErrorMessage(`failed to sendPushNotificationToUser: ${error}`)
    }
  }, [pushNotificationsStore.expoPushToken, debugStore])

  const clearOnboarding = useCallback(() => {
    onboardingStore.setHasOnboarded(false)
    secureStoreInstance.clearFromSecureStore("hasOnboarded")
  }, [])

  const clearDeviceUUID = useCallback(() => {
    secureStoreInstance.clearFromSecureStore("device_uuid")
  }, [])

  const getHistory = useCallback(async () => {
    let history = await historyService.getTestHistory()
    debugStore.addInfoMessage(JSON.stringify(history))
  }, [])

  const bumpUserScore = useCallback(async () => {
    await leaderboardStore.bumpUserScore()
    debugStore.addInfoMessage(leaderboardStore.userScore)
    alert("bumped")
  }, [])

  const nukeLeaderboardData = useCallback(async () => {
    await leaderboardServiceInstance.nukeLeaderboardData()
    alert(
      "Leaderboard data destroyed. You'll probs need to close/open or reinstall the app to reset. ",
    )
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    authenticationStore.setAuthToken("")
    authenticationStore.setAuthUsername("")
  }, [])

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text
        style={$reportBugsLink}
        tx="demoDebugScreen.reportBugs"
        onPress={() => Linking.openURL("mailto:info@qrla.io")}
      />

      <Text style={$title} preset="heading" tx="demoDebugScreen.title" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 16,
          // backgroundColor: "blue",
        }}
      >
        <Text
          text="“You all now can imagine a little Dave sitting on your shoulder, and can ask yourselves 'What would Dave do/say in this situation?’” "
          style={{
            width: "80%",
            textAlign: "center",
            fontFamily: typography.Poppins.mediumItalic,
          }}
        />
        <AutoImage
          source={require("../../../assets/images/shep.jpg")}
          style={{
            width: 200,
            height: 200,
          }}
        />
      </View>
      <View style={$itemsContainer}>
        {{ __DEV__ } && (
          <View style={$buttonContainer}>
            <Button style={$button} tx="demoDebugScreen.reactotron" onPress={demoReactotron} />
            <Text style={$hint} tx={`demoDebugScreen.${Platform.OS}ReactotronHint` as const} />
          </View>
        )}
        <View style={$buttonContainer}>
          <Button style={$button} text="Clear Debug Store" onPress={debugStore.clearAllMessages} />
        </View>
        <View style={$buttonContainer}>
          <Button
            style={$button}
            text="Send Dummy Push Notification"
            onPress={sendDummyPushNotification}
          />
        </View>
        <View style={$buttonContainer}>
          <Button
            style={$button}
            text="Make dummy test call using https route "
            onPress={dummyApiTest_HTTPS_ApiSauce}
          />
        </View>
        <View style={$buttonContainer}>
          <Button style={$button} text="Clear Onboarding " onPress={clearOnboarding} />
        </View>
        <View style={$buttonContainer}>
          <Button style={$button} text="Clear Device UUID" onPress={clearDeviceUUID} />
        </View>
        <View style={$buttonContainer}>
          <Button style={$button} text="NukeLeaderboardData " onPress={nukeLeaderboardData} />
        </View>
        <View style={$buttonContainer}>
          <Button
            style={$button}
            text="Test Sentry Error"
            onPress={() => {
              throw new Error("Hello Sentry")
            }}
          />
        </View>
        <View style={$buttonContainer}>
          <Button style={$button} text="Get History" onPress={getHistory} />
        </View>
        <View style={$buttonContainer}>
          <Button style={$button} text="Bump User Score" onPress={bumpUserScore} />
        </View>
        <View style={$buttonContainer}>
          <Button style={$button} text="logout" onPress={logout} />
        </View>
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Id</Text>
              <Text>{Application.applicationId}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Name</Text>
              <Text>{Application.applicationName}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Version</Text>
              <Text>{Application.nativeApplicationVersion}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Build Version</Text>
              <Text>{Application.nativeBuildVersion}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Hermes Enabled</Text>
              <Text>{String(usingHermes)}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Fabric Enabled</Text>
              <Text>{String(usingFabric)}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Device UUID</Text>
              <Text>
                {secureStoreInstance.device_uuid
                  ? secureStoreInstance.device_uuid
                  : " UUID Not available"}
              </Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">User Has Onboarded?</Text>
              <Text>{onboardingStore.hasOnboarded ? "Yes" : "No"}</Text>
            </View>
          }
        />

        {renderDebugStoreErrorMessages()}
        {renderDebugStoreInfoMessages()}
      </View>
    </Screen>
  )
})

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.xxl,
}

const $reportBugsLink: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.lg,
  alignSelf: isRTL ? "flex-start" : "flex-end",
}

const $item: ViewStyle = {
  marginBottom: spacing.md,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.xl,
}

const $button: ViewStyle = {
  marginBottom: spacing.xs,
}

const $buttonContainer: ViewStyle = {
  marginBottom: spacing.md,
}

const $hint: TextStyle = {
  color: colors.palette.neutral600,
  fontSize: 12,
  lineHeight: 15,
  paddingBottom: spacing.lg,
}
