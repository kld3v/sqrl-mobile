import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const TermsAndConditionsStoreModel = types
  .model("TermsAndConditionsStore")
  .props({})
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface TermsAndConditionsStore extends Instance<typeof TermsAndConditionsStoreModel> {}
export interface TermsAndConditionsStoreSnapshotOut
  extends SnapshotOut<typeof TermsAndConditionsStoreModel> {}
export interface TermsAndConditionsStoreSnapshotIn
  extends SnapshotIn<typeof TermsAndConditionsStoreModel> {}
export const createTermsAndConditionsStoreDefaultModel = () =>
  types.optional(TermsAndConditionsStoreModel, {})
