import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore/AuthenticationStore"
import { PushNotificationStoreModel } from "./PushNotificationStore/PushNotificationStore"
import { LocationStoreModel } from "./LocationStore/LocationStore"
import { TermsAndConditionsStoreModel } from "./TermsAndConditionsStore/TermsAndConditionsStore"
import { DebugStoreModel } from "./DebugStore/DebugStore"
import { OnboardingModel } from "./OnboardingStore/Onboarding"
/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  pushNotificationsStore: types.optional(PushNotificationStoreModel, {}),
  locationStore: types.optional(LocationStoreModel, {}),
  termsAndConditionsStore: types.optional(TermsAndConditionsStoreModel, {}),
  debugStore: types.optional(DebugStoreModel, {}),
  onboardingStore: types.optional(OnboardingModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
