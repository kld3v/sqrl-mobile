import React, { FC, useCallback } from "react"
import * as Application from "expo-application"
import { Linking, Platform, TextStyle, View, ViewStyle } from "react-native"
import { Button, ListItem, Screen, Text } from "../components"
import { TabScreenProps } from "../navigators/Navigator"
import { colors, spacing } from "../theme"
import { isRTL } from "../i18n"
import { useStores } from "../models"
import * as Device from "expo-device"
import { observer } from "mobx-react-lite"
import { secureStoreInstance } from "app/services/SecureStore/SecureStorageService"
import * as Clipboard from "expo-clipboard"
import { qrScannerService } from "app/services/QrScanner"

function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
}

const copyToClipboard = async (message: any) => {
  await Clipboard.setStringAsync(message)
  alert("Copied to clipboard")
}

export const DebugScreen: FC<TabScreenProps<"Debug">> = observer(function DebugScreen(_props) {
  const {
    debugStore,
    locationStore: { longitude, latitude },
  } = useStores()
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

  const dummyApiTest_Scan_fetch = useCallback(async () => {
    try {
      const response = await fetch(
        "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/scan",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: "www.apiDebuggingFetchTest_httpEndpoint.com",
            device_uuid: "0e43808c-7726-42a7-98f6-a15200fb16c2",
            latitude,
            longitude,
          }),
        },
      )
      const res = await response.json()
      debugStore.addInfoMessage(`dummyApiTest_Scan_fetch response: ${JSON.stringify(res)}`)

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
    } catch (err) {
      const error = err as Error
      debugStore.addErrorMessage(`dummyApiTest_Scan_fetch Error: ${error}`)
    }
  }, [latitude, longitude])

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

  const renderDeviceProperties = useCallback((properties: string[]) => {
    return properties.map((property) => (
      <ListItem
        key={property}
        LeftComponent={
          <View style={$item}>
            <Text preset="bold">{property}</Text>
            <Text>{Device[property as keyof typeof Device]}</Text>
          </View>
        }
      />
    ))
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

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text
        style={$reportBugsLink}
        tx="demoDebugScreen.reportBugs"
        onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite/issues")}
      />
      <Text style={$title} preset="heading" tx="demoDebugScreen.title" />
      <View style={$itemsContainer}>
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

        {renderDeviceProperties([
          "brand",
          "manufacturer",
          "modelId",
          "modelName",
          "deviceType",
          "productName",
          "osName",
          "osVersion",
          "osBuildId",
          "osInternalBuildId",
          "osBuildFingerprint",
          "totalMemory",
          "supportedCpuArchitectures",
          "deviceName",
          "deviceYearClass",
          "platformApiLevel",
          "platformVersion",
          "isDevice",
        ])}

        {renderDebugStoreErrorMessages()}
        {renderDebugStoreInfoMessages()}
      </View>
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
          text="Make dummy test call using fetch"
          onPress={dummyApiTest_Scan_fetch}
        />
      </View>
      <View style={$buttonContainer}>
        <Button
          style={$button}
          text="Make dummy test call using https route "
          onPress={dummyApiTest_HTTPS_ApiSauce}
        />
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
