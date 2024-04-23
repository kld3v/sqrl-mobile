import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { leaderboardServiceInstance } from "app/services/Leaderboard"

/**
 * Model description here for TypeScript hints.
 */
export const LeaderboardStoreModel = types
  .model("LeaderboardStore")
  .props({
    userScore: types.optional(types.string, "0"),
  })
  .actions(withSetPropAction)
  .views((store) => ({
    get getScore() {
      return store.userScore
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((store) => ({
    async setUserScoreFromSecureStorage() {
      let userScore = await leaderboardServiceInstance.getUserScoreFromStorage()
      if (!userScore) {
        return
      }
      store.setProp("userScore", userScore)
    },

    async bumpUserScore() {
      if (await leaderboardServiceInstance.bumpUserScore(store.userScore)) {
        let newScore = (parseInt(store.userScore) + 1).toString()
        store.setProp("userScore", newScore)
      }
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LeaderboardStore extends Instance<typeof LeaderboardStoreModel> {}
export interface LeaderboardStoreSnapshotOut extends SnapshotOut<typeof LeaderboardStoreModel> {}
export interface LeaderboardStoreSnapshotIn extends SnapshotIn<typeof LeaderboardStoreModel> {}
export const createLeaderboardStoreDefaultModel = () => types.optional(LeaderboardStoreModel, {})
