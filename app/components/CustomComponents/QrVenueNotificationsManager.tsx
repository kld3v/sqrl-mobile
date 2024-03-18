import * as React from "react"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useStores } from "app/models"
import { qrVenueNotificationService } from "app/services/QrVenueNotifications"
import { pushNotificationService } from "app/services/PushNotifications"

/**
 * Describe your component here
 */
export const QrVenueNotificationsManager = observer(function QrVenueNotificationsManager() {
  const { pushNotificationsStore, locationStore, debugStore } = useStores()

  useEffect(() => {
    ;(async () => {
      const { latitude, longitude } = locationStore
      if (!latitude || !longitude) return

      let qrVenueApiResponse
      try {
        qrVenueApiResponse = await qrVenueNotificationService.getCompanyAndUrlOfMatchedQrVenue(
          latitude,
          longitude,
        )
      } catch (error) {
        __DEV__ && console.error(`Failed to seeIfUserLocationMatchesQrVenueGeoFence: ${error}`)
        debugStore.addErrorMessage(`Failed to seeIfUserLocationMatchesQrVenueGeoFence: ${error}`)
      }
      debugStore.addInfoMessage(
        `latitude: ${latitude} longitude: ${longitude} sent off to QR Venue API`,
      )

      try {
        await pushNotificationsStore.fetchExpoPushToken()
      } catch (error) {
        console.error(`Failed to fetchExpoPushToken: ${error}`)
        debugStore.addErrorMessage(`Failed to fetchExpoPushToken: ${error}`)
      }

      const expoPushToken = pushNotificationsStore.expoPushToken

      if (qrVenueApiResponse && expoPushToken) {
        try {
          await pushNotificationService.sendPushNotificationToUser(expoPushToken, {
            title: `Welcome to ${qrVenueApiResponse.company}!`,
            body: "Click to see the trusted QR Destination!",
            sound: "default",
            data: { url: qrVenueApiResponse.url },
          })
        } catch (error) {
          console.error(`failed to sendPushNotificationToUser: ${error}`)
          debugStore.addErrorMessage(`failed to sendPushNotificationToUser: ${error}`)
        }
      } else {
        debugStore.addInfoMessage(
          `QrNotificationsManager -> False response or no push token: qrVenueApiResponse: ${qrVenueApiResponse} expoPushToken: ${expoPushToken}`,
        )
      }
    })()
  }, [])

  return <></>
})
