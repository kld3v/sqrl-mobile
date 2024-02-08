import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Linking, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, TextField } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"
import { useState, useEffect, useRef } from "react"
import { View, Button, Platform } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { useStores } from "app/models"

export interface PushNotificationsScreenProps extends AppStackScreenProps<"PushNotifications"> {}

export const PushNotificationsScreen: FC<PushNotificationsScreenProps> = observer(
  function PushNotificationsScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const { pushNotificationsStore } = useStores()

    const [expoPushToken, setExpoPushToken] = useState("")
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
    async function sendPushNotification(expoPushToken: any) {
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
          const url = response.notification.request.content.data.url
          Linking.openURL(url)
          console.info(`Notification response received: ${JSON.stringify(response)}`)
        },
      )

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current)
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }, [])

    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top"]}>
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          <Text>Your expo push token: {expoPushToken}</Text>
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
            value={pushNotificationsStore && pushNotificationsStore.test}
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
                await sendPushNotification(expoPushToken)
              } catch (error) {
                console.error(error)
              }
            }}
          />
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  width: "100%",
  paddingHorizontal: 20,
  paddingVertical: 20,
}
