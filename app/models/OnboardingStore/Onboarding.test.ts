import { OnboardingModel } from "./OnboardingStore/Onboarding"

test("can be created", () => {
  const instance = OnboardingModel.create({})

  expect(instance).toBeTruthy()
})
