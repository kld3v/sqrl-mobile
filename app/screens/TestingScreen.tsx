import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Linking, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, TextField } from "app/components"
// import { useNavigation } from "@react-navigation/native"
import { useState, useEffect, useRef } from "react"
import { View, Button, Platform } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { useStores } from "app/models"
// import { WebView } from "react-native-webview"
import * as WebBrowser from "expo-web-browser"

import { pushNotificationService } from "app/services/PushNotifications"

export interface TestingScreenProps extends AppStackScreenProps<"PushNotifications"> {}

export const TestingScreen: FC<TestingScreenProps> = observer(function TestingScreen() {
  // Pull in navigation via hook
  // const navigation = useNavigation()

  // Pull in one of our MST stores
  const { pushNotificationsStore } = useStores()

  const [notification, setNotification] = useState<Notifications.Notification>()
  // Tacky ts hack but it works. If you're seeing this Majeed, well alas.
  // const notificationListener = useRef<Notifications.Subscription>(undefined!)
  // const responseListener = useRef<Notifications.Subscription>(undefined!)

  // Notifications.setNotificationHandler({
  //   handleNotification: async () => ({
  //     shouldShowAlert: true,
  //     shouldPlaySound: true,
  //     shouldSetBadge: true,
  //   }),
  // })

  // Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
  // async function sendPushNotification(expoPushToken: any) {
  //   if (!pushNotificationsStore.notification) return

  //   const notificationMessageContent = pushNotificationsStore!.notification!

  //   const { title, body, data, sound } = notificationMessageContent
  //   const message = {
  //     to: expoPushToken,
  //     sound,
  //     title,
  //     body,
  //     data,
  //   }

  //   await fetch("https://exp.host/--/api/v2/push/send", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Accept-encoding": "gzip, deflate",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(message),
  //   })
  // }

  // const _handlePressButtonAsync = async (url: string) => {
  //   await WebBrowser.openBrowserAsync(url)
  // }
  useEffect(() => {
    pushNotificationsStore.fetchExpoPushToken()

    // needed to display the notification in the component text ( while testing )
    // notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
    //   setNotification(notification)
    // })

    // responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
    //   const url = response.notification.request.content.data.url
    //   _handlePressButtonAsync(url)
    // })

    return () => {
      // Notifications.removeNotificationSubscription(notificationListener.current)
      // Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top"]}>
      <View style={$webViewContainer}>
        <Button
          title="Open WebBrowser"
          onPress={async () => {
            await WebBrowser.openBrowserAsync("https://www.qrla.io")
          }}
        />
        <Text>Your expo push token: {pushNotificationsStore.expoPushToken}</Text>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <TextField
          placeholder="Title"
          style={{
            marginBottom: 10,
            width: 500,
            height: 40,
            borderWidth: 1,
            flex: 1,
          }}
          onChange={(text) => {
            pushNotificationsStore!.notification!.setTitle(text.nativeEvent.text)
          }}
          value={pushNotificationsStore.notification?.titleForMessage}
        />
        <Text>Body: {notification && notification.request.content.body}</Text>
        <TextField
          placeholder="Body"
          style={{
            marginBottom: 10,
            width: 500,
            height: 40,
            borderWidth: 1,
            flex: 1,
          }}
          value={
            pushNotificationsStore && pushNotificationsStore.notification
              ? pushNotificationsStore.notification.bodyForMessage || ""
              : ""
          }
        />

        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        <TextField
          placeholder="Data"
          style={{
            marginBottom: 10,
            width: 500,
            height: 40,
            borderWidth: 1,
            flex: 1,
          }}
          value={
            pushNotificationsStore && pushNotificationsStore.notification
              ? pushNotificationsStore.notification.dataForMessage || ""
              : ""
          }
        />

        <Button
          title="Press to Send Notification"
          onPress={async () => {
            try {
              if (pushNotificationsStore.expoPushToken && pushNotificationsStore.notification) {
                await pushNotificationService.sendPushNotificationToUser(
                  pushNotificationsStore.expoPushToken,
                  pushNotificationsStore.notification,
                )
              } else {
                console.error("No expo push token found")
                return
              }
            } catch (error) {
              console.error(error)
            }
          }}
        />
        {/* <WebView
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          source={{ uri: "https://expo.dev" }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.warn("WebView error: ", nativeEvent)
          }}
          onLoadEnd={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.warn("WebView load end: ", nativeEvent)
          }}
          onLoad={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.warn("WebView load: ", nativeEvent)
          }}
        /> */}
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  width: "100%",
  paddingHorizontal: 20,
  paddingVertical: 20,
}

const $webViewContainer: ViewStyle = {
  width: "100%",
  height: "100%",
  zIndex: 1000,
}
