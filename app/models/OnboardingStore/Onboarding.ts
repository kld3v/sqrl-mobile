import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const OnboardingModel = types
  .model("Onboarding")
  .props({
    hasOnboarded: types.optional(types.boolean, true),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setHasOnboarded: (value: boolean) => {
      self.hasOnboarded = value
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Onboarding extends Instance<typeof OnboardingModel> {}
export interface OnboardingSnapshotOut extends SnapshotOut<typeof OnboardingModel> {}
export interface OnboardingSnapshotIn extends SnapshotIn<typeof OnboardingModel> {}
export const createOnboardingDefaultModel = () => types.optional(OnboardingModel, {})
