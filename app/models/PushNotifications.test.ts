import { PushNotificationsModel } from "./PushNotifications"

test("can be created", () => {
  const instance = PushNotificationsModel.create({})

  expect(instance).toBeTruthy()
})
