import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { DocumentResponseObject, termsService } from "app/services/Terms"

/**
 * Model description here for TypeScript hints.
 */
export const TermsAndConditionsStoreModel = types
  .model("TermsAndConditionsStore")
  .props({
    termsIds: types.optional(types.array(types.number), []),
    userHasAcceptedTerms: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get hasTermsToSign(): boolean {
      return self.termsIds.length > 0
    },
    get hasUserAcceptedTerms(): boolean {
      return self.userHasAcceptedTerms
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    async signUserAgreements(): Promise<void> {
      await termsService.signUserAgreements(self.termsIds)
      self.setProp("userHasAcceptedTerms", true)
    },

    async checkIfUserHasSignedUpToDateContract(): Promise<void> {
      let documentsToSign: DocumentResponseObject[] | false | Error =
        await termsService.checkUserAgreements()

      if (documentsToSign instanceof Error) {
        console.error("Error checking user agreements API Request", documentsToSign)
        return
      }
      if (!documentsToSign) {
        self.setProp("termsIds", [])
        console.log("No documents to sign")
      }
      if (documentsToSign) {
        self.setProp(
          "termsIds",
          documentsToSign.map((doc) => doc.id),
        )
        console.log("Docs to sign")
      }
    },
    addDocumentIdToTermIDs(docId: number): void {
      self.termsIds.push(docId)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface TermsAndConditionsStore extends Instance<typeof TermsAndConditionsStoreModel> {}
export interface TermsAndConditionsStoreSnapshotOut
  extends SnapshotOut<typeof TermsAndConditionsStoreModel> {}
export interface TermsAndConditionsStoreSnapshotIn
  extends SnapshotIn<typeof TermsAndConditionsStoreModel> {}
export const createTermsAndConditionsStoreDefaultModel = () =>
  types.optional(TermsAndConditionsStoreModel, {})

// create an initital state
