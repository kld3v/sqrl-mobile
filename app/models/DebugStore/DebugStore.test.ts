import { DebugStoreModel } from "./DebugStore"

test("can be created", () => {
  const instance = DebugStoreModel.create({})

  expect(instance).toBeTruthy()
})
