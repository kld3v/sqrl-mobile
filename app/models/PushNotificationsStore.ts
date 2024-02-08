import { types } from "mobx-state-tree"
import { PushNotificationModel } from "./PushNotifications"
import { withSetPropAction } from "./helpers/withSetPropAction"

const defaultNotification = PushNotificationModel.create({
  title: "title",
  body: "body",
  sound: "default",
  data: { url: "https://www.google.com" },
})

export const PushNotificationsStoreModel = types
  .model("PushNotificationsStore")
  .props({
    notification: types.maybe(PushNotificationModel),
    test: types.optional(types.string, "test"),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    addNotification(notification: any) {
      store.notification = notification
    },
    clearNotification() {
      store.notification = defaultNotification
    },
  }))
