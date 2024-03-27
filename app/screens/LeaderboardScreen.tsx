import React, { FC, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, Screen, Text } from "app/components"
import { $rootScreen, $title, colors } from "app/theme"
import { leaderboardServiceInstance } from "app/services/Leaderboard"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface LeaderboardScreenProps extends AppStackScreenProps<"Leaderboard"> {}

type UserScore = {
  username: string
  score: number
  mult?: number
}

export const LeaderboardScreen: FC<LeaderboardScreenProps> = observer(function LeaderboardScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const [leaderboardData, setLeaderboardData] = useState<UserScore[]>([])

  const sortedLeaderboardData = useMemo(() => {
    // Copy the array before sorting to avoid mutating the original state
    const sortedData = [...leaderboardData].sort((a, b) => b.score - a.score)
    return sortedData
  }, [leaderboardData])

  const renderLeaderboard = (): React.ReactNode => {
    return sortedLeaderboardData.map((el) => {
      return (
        <Card
          key={`${el.username}+${el.mult}+${Math.random()}`}
          heading={`${el.username}, ${el.score}`}
          headingStyle={{ color: "black" }}
        />
      )
    })
  }

  useEffect(() => {
    ;(async () => {
      await leaderboardServiceInstance.waitForInitToComplete()
      let dummyData = await leaderboardServiceInstance.getDummyLeaderboardDataFromStorage()
      let userData = await leaderboardServiceInstance.getUserScoreAndUserNameFromStorage()

      if (!dummyData || !userData) {
        console.log("dummyData", dummyData, "userData", userData)
        return
      }
      let userDataFormatted = {
        username: userData.username,
        score: parseInt(userData.score),
      }
      let leaderboardData = [...dummyData, userDataFormatted]

      setLeaderboardData(leaderboardData)
    })()
  }, [])

  return (
    <Screen style={$rootScreen} preset="scroll" safeAreaEdges={["top"]}>
      <Text preset={"heading"} tx="leaderboardScreen.title" style={$title} />
      <Text tx="leaderboardScreen.subHeader" />
      <View style={{ marginBottom: 48, backgroundColor: colors.background }}>
        {renderLeaderboard()}
      </View>
    </Screen>
  )
})
