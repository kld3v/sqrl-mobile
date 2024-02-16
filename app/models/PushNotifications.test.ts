import { PushNotificationsModel } from "./MessageModel"

test("can be created", () => {
  const instance = PushNotificationsModel.create({})

  expect(instance).toBeTruthy()
})
