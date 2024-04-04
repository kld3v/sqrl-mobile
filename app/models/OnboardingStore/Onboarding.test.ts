import { OnboardingModel } from "./Onboarding"

test("can be created", () => {
  const instance = OnboardingModel.create({})

  expect(instance).toBeTruthy()
})
