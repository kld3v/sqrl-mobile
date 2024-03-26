import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, Screen, Text } from "app/components"
import { $rootScreen, $title } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface LeaderboardScreenProps extends AppStackScreenProps<"Leaderboard"> {}

type UserScore = {
  username: string
  score: number
  mult: number
}

export const LeaderboardScreen: FC<LeaderboardScreenProps> = observer(function LeaderboardScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const [leaderboardData, setLeaderboardData] = useState<UserScore[]>([
    {
      username: "fanning-ashil161",
      score: 3,
      mult: 2.68,
    },
    {
      username: "jovialjaclyn712",
      score: 0,
      mult: 2.63,
    },
    {
      username: "meggieoutgoing",
      score: 1,
      mult: 2.35,
    },
    {
      username: "arlinegeorgetta825",
      score: 3,
      mult: 2.17,
    },
    {
      username: "jitterykissner",
      score: 2,
      mult: 1.93,
    },
    {
      username: "klinglercurious554",
      score: 1,
      mult: 1.87,
    },
    {
      username: "mayaradiant346",
      score: 0,
      mult: 1.82,
    },
    {
      username: "boldemrick532",
      score: 0,
      mult: 1.67,
    },
    {
      username: "oconnorjacqueline203",
      score: 0,
      mult: 1.56,
    },
    {
      username: "marylunstoppable",
      score: 3,
      mult: 1.52,
    },
    {
      username: "nord-aeriela212",
      score: 3,
      mult: 1.46,
    },
    {
      username: "peevishsidoney",
      score: 3,
      mult: 1.39,
    },
    {
      username: "brittacurious",
      score: 1,
      mult: 1.86,
    },
    {
      username: "winnigraceful457",
      score: 2,
      mult: 1.28,
    },
    {
      username: "keendruci213",
      score: 3,
      mult: 1.25,
    },
    {
      username: "unrulysteverson",
      score: 0,
      mult: 1.19,
    },
    {
      username: "sallyanneunique445",
      score: 0,
      mult: 1.93,
    },
    {
      username: "marottagertrud",
      score: 0,
      mult: 0.9,
    },
    {
      username: "dann-liane",
      score: 3,
      mult: 1.89,
    },
  ])

  const renderLeaderboard = (): React.ReactNode => {
    return leaderboardData.map((el) => {
      return <Card heading={el.username} headingStyle={{ color: "black" }} />
    })
  }

  return (
    <Screen style={$rootScreen} preset="scroll" safeAreaEdges={["top"]}>
      <Text preset={"heading"} tx="leaderboardScreen.title" style={$title} />
      <Text tx="leaderboardScreen.subHeader" />
      {renderLeaderboard()}
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
