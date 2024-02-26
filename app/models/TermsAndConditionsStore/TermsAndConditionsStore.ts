import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { DocumentResponseObject, termsService } from "app/services/Terms"
import { TermsModel } from "./Terms"

/**
 * Model description here for TypeScript hints.
 */
export const TermsAndConditionsStoreModel = types
  .model("TermsAndConditionsStore")
  .props({
    terms: types.optional(types.array(TermsModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    // get hasTermsToSign(): boolean {
    //   return self.termsIds?.length > 0
    // },

    get userHasTermsToSign(): boolean {
      console.log(self.terms.length, "terms length")
      return self.terms.length > 0
    },

    get termsIds(): number[] {
      return self.terms.map((term) => term.id)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((store) => ({
    clearTerms(): void {
      store.setProp("terms", [])
    },

    async signUserAgreements(): Promise<void> {
      await termsService.signUserAgreements(store.termsIds)
      this.clearTerms()
    },

    async checkIfUserHasSignedUpToDateContract(): Promise<void> {
      let documentsToSign: DocumentResponseObject[] | false | Error =
        await termsService.checkUserAgreements()

      if (documentsToSign instanceof Error) {
        console.error("Error checking user agreements API Request", documentsToSign)
        return
      }
      if (!documentsToSign) {
        store.setProp("terms", [])
        console.log("No documents to sign")
      }
      if (documentsToSign) {
        store.setProp(
          "terms",
          documentsToSign.map((doc) => {
            return {
              guid: Math.random().toString(),
              id: doc.id,
              term_name: doc.term_name,
              term_url: doc.term_url,
            }
          }),
        )
        console.log("Docs to sign")
      }
    },
    addDummyDocumentToSign(): void {
      store.terms.push({
        guid: Math.random().toString(),
        id: Math.random() * 1000,
        term_name: "Dummy Document",
        term_url: "https://qrla.io",
      })
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
