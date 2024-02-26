import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { PushNotificationsStoreModel } from "./PushNotificationsStore"
import { LocationStoreModel } from "./LocationStore"
import { TermsAndConditionsStoreModel } from "./TermsAndConditionsStore/TermsAndConditionsStore"
/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  pushNotificationsStore: types.optional(PushNotificationsStoreModel, {}),
  locationStore: types.optional(LocationStoreModel, {}),
  termsAndConditionsStore: types.optional(TermsAndConditionsStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
