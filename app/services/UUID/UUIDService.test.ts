import UUIDService from "./UUIDService"

// Mocking expo-crypto module
jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(() => "123e4567-e89b-12d3-a456-426614174000"),
}))

describe("UUIDService", () => {
  it("should generate a valid UUID", () => {
    const uuid = UUIDService.generateUUID()
    expect(uuid).toMatch(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    )
  })
})
