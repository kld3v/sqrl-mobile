import { types } from "mobx-state-tree"
import { MessageModel } from "./MessageModel"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const PushNotificationsStoreModel = types
  .model("PushNotificationsStore")
  .props({
    notification: types.maybe(MessageModel),
    expoPushToken: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    addNotification(notification: any) {
      store.notification = notification
    },
    clearNotification() {
      let reset = MessageModel.create({
        title: "Hello from Qrlab!",
        body: "What's going on",
        sound: "default",
        data: { url: "https://www.qrla.io" },
      })
      store.notification = reset
    },
  }))
