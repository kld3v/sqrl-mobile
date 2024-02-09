import { types } from "mobx-state-tree"
import { PushNotificationModel } from "./PushNotifications"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const PushNotificationsStoreModel = types
  .model("PushNotificationsStore")
  .props({
    notification: types.maybe(PushNotificationModel),
    expoPushToken: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    addNotification(notification: any) {
      store.notification = notification
    },
    clearNotification() {
      let reset = PushNotificationModel.create({
        title: "title",
        body: "body",
        sound: "default",
        data: { url: "https://www.google.com" },
      })
      store.notification = reset
    },
  }))
