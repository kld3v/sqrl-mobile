import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useStores } from "app/models"
import { qrVenueNotificationService } from "app/services/QrVenueNotifications"
import { pushNotificationService } from "app/services/PushNotifications"

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

  useEffect(() => {
    ;(async () => {
      const qrVenueApiResponse =
        await qrVenueNotificationService.seeIfUserLocationMatchesQrVenueGeoFence()

      const expoPushToken = pushNotificationsStore.expoPushToken

      const messageToSend = {
        title: "You are near a venue",
        body: "Click to see the menu",
        sound: "default",
        data: { url: "" },
      }

      if (qrVenueApiResponse && expoPushToken) {
        messageToSend.data.url = qrVenueApiResponse.url
        pushNotificationService.sendPushNotificationToUser(expoPushToken, messageToSend)
      } else {
        console.warn(
          `User location does not match any venue geo-fence or expoPushToken unavailable: qrVenueApiResponse: ${qrVenueApiResponse} expoPushToken: ${expoPushToken}`,
        )
      }
    })()
  }, [])

  return <></>
})
