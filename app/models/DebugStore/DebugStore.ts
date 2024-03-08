import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const DebugStoreModel = types
  .model("DebugStore")
  .props({
    errorMessages: types.optional(types.array(types.string), []),
    infoMessages: types.optional(types.array(types.string), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addErrorMessage(message: string) {
      self.errorMessages.push(message)
    },
    addInfoMessage(message: string) {
      self.infoMessages.push(message)
    },
    clearAllMessages() {
      self.errorMessages.clear()
      self.infoMessages.clear()
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface DebugStore extends Instance<typeof DebugStoreModel> {}
export interface DebugStoreSnapshotOut extends SnapshotOut<typeof DebugStoreModel> {}
export interface DebugStoreSnapshotIn extends SnapshotIn<typeof DebugStoreModel> {}
export const createDebugStoreDefaultModel = () => types.optional(DebugStoreModel, {})
