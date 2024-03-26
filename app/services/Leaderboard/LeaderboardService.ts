import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { api } from "../api"
import { LeaderboardEntry } from "./LeaderboardService.types"
import * as Device from "expo-device"

export class LeaderboardService {
  public initialised: Promise<boolean> | null = null
  constructor() {
    this.initialised = this.init()
  }

  async init(): Promise<boolean> {
    try {
      if (!(await this.userHasScoreInStorage())) {
        await this.initUserScoreInStorage()
        //TODO
        let name = Device.deviceName ? Device.deviceName : "Sheppard"
        await this.initUserNameInStorage(name)
      }
      if (!(await this.dummyLeaderboardDataExists())) {
        let data = await this.getDummyLeaderboardDataForFirstTime()
        data && (await this.saveDummyLeaderboardData(data))
      }
    } catch (error) {
      console.log(error, "failed during init")
    }
    return true
  }

  async waitForInitToComplete() {
    await this.initialised
  }

  async userHasScoreInStorage(): Promise<boolean> {
    let score = await secureStoreInstance.getValueFromSecureStore("userScore")
    // don't just test for truthyness of score because "0" is probably truthy knowing js...
    return typeof score === "string"
  }

  async initUserScoreInStorage(): Promise<boolean> {
    try {
      await secureStoreInstance.setValueInSecureStore("userScore", "0")
    } catch (error) {
      console.log("error init user score")
      return false
    }
    return true
  }

  async bumpUserScore(): Promise<boolean> {
    try {
      let currentScore = await secureStoreInstance.getValueFromSecureStore("userScore")
      if (currentScore === null) return false
      let updatedScore = (parseInt(currentScore, 10) + 1).toString()
      await secureStoreInstance.setValueInSecureStore("userScore", updatedScore)
    } catch (error) {
      console.log("error setting user store")
      return false
    }
    return true
  }

  async getUserScoreAndUserNameFromStorage(): Promise<false | { username: string; score: number }> {
    let username = await secureStoreInstance.getValueFromSecureStore("userName")
    let score = await secureStoreInstance.getValueFromSecureStore("userScore")
    console.log(username, score)
    if (username === null || score === null) return false
    return {
      username,
      score: Number(score),
    }
  }

  async initUserNameInStorage(userName: string): Promise<boolean> {
    try {
      await secureStoreInstance.setValueInSecureStore("userName", userName)
    } catch (error) {
      console.log("error init user score")
      return false
    }
    return true
  }

  async dummyLeaderboardDataExists(): Promise<boolean> {
    try {
      const dataExists = await AsyncStorage.getItem("@leaderboardData")
      if (dataExists === null) return false
    } catch (error) {
      console.log("failed to check if leaderboard data exists")
      return false
    }
    return true
  }

  async getDummyLeaderboardDataForFirstTime(): Promise<LeaderboardEntry[] | false> {
    try {
      let res = await api.apisauce.get("/random-leaderboard")
      if (res.ok) return res.data as LeaderboardEntry[]
    } catch (error) {
      console.log(error, "failed to get dummy leaderboard data")
      return false
    }
    return false
  }

  async getDummyLeaderboardDataFromStorage(): Promise<LeaderboardEntry[] | false> {
    try {
      let jsonValue = await AsyncStorage.getItem("@leaderboardData")
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (error) {
      console.log(error, "failed to get dummy leaderboard data")
    }
    return false
  }

  async saveDummyLeaderboardData(dummyLeaderboardData: LeaderboardEntry[]): Promise<boolean> {
    try {
      let dummyUserScores = JSON.stringify(dummyLeaderboardData)
      await AsyncStorage.setItem("@leaderboardData", dummyUserScores)
    } catch (error) {
      console.log(error, "failed to save dummy leaderboard data")
      return false
    }
    return true
  }

  async incrementDummyLeadboardData(): Promise<boolean> {
    try {
      let dummyUserScores = await this.getDummyLeaderboardDataFromStorage()
      if (!dummyUserScores) return false
      const updatedDummyUserScores: LeaderboardEntry[] = dummyUserScores.map((dummyUser) => {
        const randomNumber = Math.random()
        const updatedScore = Math.round(dummyUser.score + randomNumber * dummyUser.mult)
        return { ...dummyUser, score: updatedScore }
      })
      return await this.saveDummyLeaderboardData(updatedDummyUserScores)
    } catch (error) {
      console.log(error, "failed to incremend leaderboard data")
      return false
    }
  }
}

export const leaderboardInstance = new LeaderboardService()
