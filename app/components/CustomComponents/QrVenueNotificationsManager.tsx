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
  const { pushNotificationsStore, locationStore } = useStores()

  useEffect(() => {
    ;(async () => {
      const { latitude, longitude } = locationStore

      if (latitude === undefined || longitude === undefined) return

      const qrVenueApiResponse =
        await qrVenueNotificationService.seeIfUserLocationMatchesQrVenueGeoFence(
          latitude,
          longitude,
        )

      await pushNotificationsStore.fetchExpoPushToken()

      const expoPushToken = pushNotificationsStore.expoPushToken

      if (qrVenueApiResponse && expoPushToken) {
        try {
          await pushNotificationService.sendPushNotificationToUser(expoPushToken, {
            title: `Welcome to ${qrVenueApiResponse.company}!`,
            body: "Click to see the trusted QR",
            sound: "default",
            data: { url: qrVenueApiResponse.url },
          })
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
