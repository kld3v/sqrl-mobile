import { MessageModel } from "./MessageModel"

test("can be created", () => {
  const instance = MessageModel.create({
    title: "Test Title",
    body: "Test Body",
    sound: "Test Sound",
    data: { url: "Test URL" },
  })

  expect(instance).toBeTruthy()
})
