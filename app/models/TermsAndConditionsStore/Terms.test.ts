import { TermsModel } from "./Terms"

test("can be created", () => {
  const instance = TermsModel.create({
    guid: "Test GUID",
    id: 123123,
    term_name: "Test Term Name",
    term_url: "Test Term URL",
  })

  expect(instance).toBeTruthy()
})
