import { TermsAndConditionsStoreModel } from "./TermsAndConditionsStore"

test("can be created", () => {
  const instance = TermsAndConditionsStoreModel.create({})

  expect(instance).toBeTruthy()
})
