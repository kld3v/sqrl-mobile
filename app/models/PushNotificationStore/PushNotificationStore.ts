import { types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { pushNotificationService } from "../../services/PushNotifications"

export const PushNotificationStoreModel = types
  .model("PushNotificationStore")
  .props({
    expoPushToken: types.maybe(types.string),
    pushNotificationsError: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchExpoPushToken() {
      try {
        const token = await pushNotificationService.registerForPushNotificationsAsync()

        if (token) {
          store.setProp("expoPushToken", token)
        } else {
          store.pushNotificationsError = "Failed to get push token for push notification!"
        }
      } catch (error) {
        console.error(error)
      }
    },
  }))
  .views((store) => ({}))
