import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useStores } from "app/models"
import { qrVenueNotificationService } from "app/services/QrVenueNotifications"
import { pushNotificationService } from "app/services/PushNotifications"

export interface QrVenueNotificationsManagerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const QrVenueNotificationsManager = observer(function QrVenueNotificationsManager(
  props: QrVenueNotificationsManagerProps,
) {
  const { pushNotificationsStore } = useStores()

  useEffect(() => {
    pushNotificationsStore.fetchExpoPushToken()
    ;(async () => {
      const qrVenueApiResponse =
        await qrVenueNotificationService.seeIfUserLocationMatchesQrVenueGeoFence()
      console.log(qrVenueApiResponse, "venueApiResponse")

      const expoPushToken = pushNotificationsStore.expoPushToken

      const messageToSend = {
        title: "You are near a venue",
        body: "Click to see the menu",
        sound: "default",
        data: { url: "" },
      }

      if (qrVenueApiResponse && expoPushToken) {
        try {
          messageToSend.data.url = qrVenueApiResponse.url

          await pushNotificationService.sendPushNotificationToUser(expoPushToken, messageToSend)
        } catch (error) {
          console.error(`failed to sendPushNotificationToUser: ${error}`)
        }
      } else {
        console.warn(
          `Error in QrVenueNotificationManager: qrVenueApiResponse: ${qrVenueApiResponse} expoPushToken: ${expoPushToken}`,
        )
      }
    })()
  }, [])

  return <></>
})
