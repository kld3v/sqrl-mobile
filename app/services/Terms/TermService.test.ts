import { termsService } from "./TermsService"
import { api } from "../api"
import { secureStoreInstance } from "../SecureStore/SecureStorageService"

jest.mock("../api")
jest.mock("../SecureStore/SecureStorageService")

describe("TermsService", () => {
  describe("checkUserAgreements", () => {
    it("should return documents to sign on successful API call", async () => {
      // Setup mocks
      secureStoreInstance.getDeviceUUID = jest.fn().mockResolvedValueOnce("mock-uuid")
      api.apisauce.get = jest.fn().mockResolvedValueOnce({
        ok: true,
        data: {
          documents_to_sign: [{ id: 1, term_name: "Document 1", term_url: "www.document1.com" }],
        },
      })

      // Execute the method
      const result = await termsService.checkUserAgreements()

      // Assertions
      expect(result).toEqual([{ id: 1, term_name: "Document 1", term_url: "www.document1.com" }])
      expect(api.apisauce.get).toHaveBeenCalledWith("/agreements/check", {
        device_uuid: "mock-uuid",
      })
    })

    it("should return false on unsuccessful API call", async () => {
      // Setup mocks
      secureStoreInstance.getDeviceUUID = jest.fn().mockResolvedValueOnce("mock-uuid")
      api.apisauce.get = jest.fn().mockResolvedValueOnce({ ok: false })

      // Execute the method
      const result = await termsService.checkUserAgreements()

      // Assertions
      expect(result).toBe(false)
      expect(api.apisauce.get).toHaveBeenCalledWith("/agreements/check", {
        device_uuid: "mock-uuid",
      })
    })
  })

  describe("signUserAgreements", () => {
    it("should make a successful API call", async () => {
      // Setup mocks
      secureStoreInstance.getDeviceUUID = jest.fn().mockResolvedValueOnce("mock-uuid")
      api.apisauce.post = jest.fn().mockResolvedValueOnce({ ok: true })

      // Execute the method
      await termsService.signUserAgreements([1, 2])

      // Assertions
      expect(api.apisauce.post).toHaveBeenCalledWith("/agreements/sign", {
        device_uuid: "mock-uuid",
        document_version_ids: [1, 2],
      })
    })

    it("should handle error on unsuccessful API call", async () => {
      // Setup mocks
      secureStoreInstance.getDeviceUUID = jest.fn().mockResolvedValueOnce("mock-uuid")
      api.apisauce.post = jest.fn().mockResolvedValueOnce({ ok: false })

      // Execute the method
      await termsService.signUserAgreements([1, 2])

      // Assertions
      expect(api.apisauce.post).toHaveBeenCalledWith("/agreements/sign", {
        device_uuid: "mock-uuid",
        document_version_ids: [1, 2],
      })
    })
  })
})
