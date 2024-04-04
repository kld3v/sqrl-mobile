import { TermsModel } from "./Terms"

test("can be created", () => {
  const instance = TermsModel.create({
    guid: "Test GUID",
    id: 123123,
    document_name: "Test Term Name",
    document_url: "Test Term URL",
  })

  expect(instance).toBeTruthy()
})
