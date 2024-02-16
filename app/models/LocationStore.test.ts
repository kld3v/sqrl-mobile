import { LocationStoreModel } from "./LocationStore"

test("can be created", () => {
  const instance = LocationStoreModel.create({})

  expect(instance).toBeTruthy()
})
