import { ApisauceInstance, create } from "apisauce"
import { PushNotificationServiceConfig } from "./PushNotificationService.types"
import { Platform } from "react-native"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import * as Device from "expo-device"
import * as WebBrowser from "expo-web-browser"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export class PushNotificationService {
  apisauce: ApisauceInstance
  config: PushNotificationServiceConfig
  handleUserNotificationAction: any

  constructor() {
    this.config = {
      url: "https://exp.host/--/api/v2/push/send",
      timeout: 10000,
    }

    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    })

    this.handleUserNotificationAction = // Ie handle a user action on a notification
      Notifications.addNotificationResponseReceivedListener((response) => {
        const url = response.notification.request.content.data.url
        this.handleNotificationTap(url)
      })
  }

  async handleNotificationTap(url: string): Promise<void> {
    await WebBrowser.openBrowserAsync(url)
  }

  async registerForPushNotificationsAsync(): Promise<string | undefined> {
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
    } else {
      alert("Must use physical device for Push Notifications")
      return
    }
    return token.data
  }

  async sendPushNotificationToUser(
    expoPushToken: string,
    message: {
      title: string
      body: string
      sound: string
      data: { url: string }
    },
  ): Promise<void> {
    let messageToSend = { ...message, to: expoPushToken }
    try {
      const response = await this.apisauce.post("", messageToSend)
      if (!response.ok) {
        console.error("Failed to send push notification to user")
      }
    } catch (error) {
      console.error(error)
    }
  }
}

// Singleton instance of the PushNotificationService
// Make sure you import the right thing!! This is a common source of bugs
export const pushNotificationService = new PushNotificationService()
