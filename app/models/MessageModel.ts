import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */

export const MessageModel = types
  .model("Message")
  .props({
    title: types.string,
    body: types.string,
    sound: types.string,
    data: types.model({ url: types.string }),
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

export interface Messages extends Instance<typeof MessageModel> {}
export interface MessagesSnapshotOut extends SnapshotOut<typeof MessageModel> {}
export interface MessagesSnapshotIn extends SnapshotIn<typeof MessageModel> {}
export const createMessagesDefaultModel = () => types.optional(MessageModel, {})
