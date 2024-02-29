import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore/AuthenticationStore"
import { PushNotificationStoreModel } from "./PushNotificationStore/PushNotificationStore"
import { LocationStoreModel } from "./LocationStore/LocationStore"
import { TermsAndConditionsStoreModel } from "./TermsAndConditionsStore/TermsAndConditionsStore"
/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  pushNotificationsStore: types.optional(PushNotificationStoreModel, {}),
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
