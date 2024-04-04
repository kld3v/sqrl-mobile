import { LeaderboardStoreModel } from "./LeaderboardStore"

test("can be created", () => {
  const instance = LeaderboardStoreModel.create({})

  expect(instance).toBeTruthy()
})
