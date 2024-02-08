import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */

export const PushNotificationModel = types
  .model("PushNotification")
  .props({
    title: types.optional(types.string, "hello"),
    body: types.maybe(types.string),
    sound: types.maybe(types.string),
    data: types.maybe(types.model({ url: types.string })),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get titleForMessage() {
      return `${self.title}`
    },
    get bodyForMessage() {
      return `${self.body}`
    },
    get soundForMessage() {
      return `${self.sound}`
    },
    get dataForMessage() {
      return `${JSON.stringify(self.data)}`
    },
  })) // eslint-disable-line @typescript-eslint/kdno-unused-vars
  .actions((self) => ({
    setTitle(title: string) {
      self.title = title
    },
    setBody(body: string) {
      self.body = body
    },
    setSound(sound: string) {
      self.sound = sound
    },
    setData(data: any) {
      self.data = data
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface PushNotifications extends Instance<typeof PushNotificationModel> {}
export interface PushNotificationsSnapshotOut extends SnapshotOut<typeof PushNotificationModel> {}
export interface PushNotificationsSnapshotIn extends SnapshotIn<typeof PushNotificationModel> {}
export const createPushNotificationsDefaultModel = () => types.optional(PushNotificationModel, {})
