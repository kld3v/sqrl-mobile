import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"
import { useState, useEffect, useRef } from "react"
import { View, Button, Platform } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Subscription } from "expo-notifications"
export interface PushNotificationsScreenProps extends AppStackScreenProps<"PushNotifications"> {}

export const PushNotificationsScreen: FC<PushNotificationsScreenProps> = observer(
  function PushNotificationsScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const [expoPushToken, setExpoPushToken] = useState("")
    const [notification, setNotification] = useState<Notification>()
    const notificationListener = useRef<Subscription>()
    const responseListener = useRef<Subscription>()

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    })

    // Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
    async function sendPushNotification(expoPushToken: any) {
      const message = {
        to: expoPushToken,
        sound: "default",
        title: "Original Title",
        body: "And here is the body!",
        data: { someData: "goes here" },
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
        console.log(token)
      } else {
        alert("Must use physical device for Push Notifications")
        return
      }

      return token.data
    }

    useEffect(() => {
      registerForPushNotificationsAsync().then((token) => setExpoPushToken(token as string))

      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          setNotification(notification)
        },
      )

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log(response)
        },
      )

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current)
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }, [])

    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top"]}>
        <Text text="pushNotifications" />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
