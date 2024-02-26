import { TermsModel } from "./Terms"

test("can be created", () => {
  const instance = TermsModel.create({})

  expect(instance).toBeTruthy()
})
