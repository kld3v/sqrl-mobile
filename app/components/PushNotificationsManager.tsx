import * as React from "react"
import { Linking, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"

import { useState, useEffect, useRef } from "react"
import { Text, View, Button, Platform } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Subscription } from "expo-notifications"
import { useStores } from "app/models"
export interface PushNotificationsManagerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const PushNotificationsManager = observer(function PushNotificationsManager(
  props: PushNotificationsManagerProps,
) {
  const { pushNotificationsStore } = useStores()

  const [notification, setNotification] = useState<Notifications.Notification>()
  // Tacky ts hack but it works. If you're seeing this Majeed, well alas.
  const notificationListener = useRef<Notifications.Subscription>(undefined!)
  const responseListener = useRef<Notifications.Subscription>(undefined!)

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  })

  // Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
  async function sendPushNotification(expoPushToken: string) {
    if (!pushNotificationsStore.notification) return

    const notificationMessageContent = pushNotificationsStore!.notification!

    const { title, body, data, sound } = notificationMessageContent
    const message = {
      to: expoPushToken,
      sound,
      title,
      body,
      data,
    }

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
  }

  async function registerForPushNotificationsAsync() {
    let token

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    // Test for physical device.
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!")
        return
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants!.expoConfig!.extra!.eas.projectId,
      })
    } else {
      alert("Must use physical device for Push Notifications")
      return
    }
    return token.data
  }

  useEffect(() => {
    pushNotificationsStore.addNotification({
      title: "title",
      body: "body",
      sound: "default",
      data: { url: "https://www.google.com" },
    })
    registerForPushNotificationsAsync().then((token) =>
      pushNotificationsStore.setProp("expoPushToken", token as string),
    )

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data.url
      Linking.openURL(url)
      console.info(`Notification response received: ${JSON.stringify(response)}`)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return <></>
})
