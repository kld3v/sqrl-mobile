import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const TermsModel = types
  .model("Terms")
  .props({
    guid: types.identifier,
    id: 0,
    term_name: "",
    term_url: "",
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Terms extends Instance<typeof TermsModel> {}
export interface TermsSnapshotOut extends SnapshotOut<typeof TermsModel> {}
export interface TermsSnapshotIn extends SnapshotIn<typeof TermsModel> {}
