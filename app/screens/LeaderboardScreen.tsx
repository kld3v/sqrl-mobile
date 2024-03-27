import React, { FC, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, Screen, Text } from "app/components"
import { $rootScreen, $title, colors, spacing, typography } from "app/theme"
import { leaderboardServiceInstance } from "app/services/Leaderboard"
import { useStores } from "app/models"
import Leaf from "app/components/Svg/Leaf"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface LeaderboardScreenProps extends AppStackScreenProps<"Leaderboard"> {}

type UserScore = {
  username: string
  score: number
  mult?: number
  user?: boolean
}

export const LeaderboardScreen: FC<LeaderboardScreenProps> = observer(function LeaderboardScreen() {
  // Pull in one of our MST stores
  const { leaderboardStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const [leaderboardData, setLeaderboardData] = useState<UserScore[]>([])

  const sortedLeaderboardData = useMemo(() => {
    // Copy the array before sorting to avoid mutating the original state
    const sortedData = [...leaderboardData].sort((a, b) => b.score - a.score)
    return sortedData
  }, [leaderboardData])

  const renderLeaderboard = (): React.ReactNode => {
    return sortedLeaderboardData.map((el, index) => {
      return (
        <View key={el.username} style={el.user ? $userTableRow : $tableRow}>
          <Text style={{ ...$positionColStyle, ...$tableRowEntryStyle }}>{index + 1} </Text>
          <Text style={{ ...$userNameColStyle, ...$tableRowEntryStyle }} text={el.username} />
          <View style={$scoreColContainer}>
            <Text style={$scoreColEntryTextOnlyStyle} text={el.score.toString()} />
            <Leaf
              style={{
                transform: [{ scale: 1 }],
                marginLeft: 6,
                marginTop: -4,
              }}
            />
          </View>
        </View>
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
        user: true,
      }
      let leaderboardData = [...dummyData, userDataFormatted]

      setLeaderboardData(leaderboardData)
    })()
  }, [leaderboardStore.userScore])

  return (
    <Screen style={$rootScreen} preset="scroll" safeAreaEdges={["top"]}>
      <Text preset={"heading"} tx="leaderboardScreen.title" style={$title} />
      <Text
        preset={"subheading"}
        tx="leaderboardScreen.subHeader"
        style={{
          textAlign: "center",
          paddingBottom: spacing.lg,
          color: colors.palette.neutral800,
        }}
      />
      <View
        style={{
          marginBottom: 48,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
          }}
        >
          {/* <Text style={{ ...$positionColStyle, ...$tableHeadStyle }}>Pos</Text>
          <Text style={{ ...$userNameColStyle, ...$tableHeadStyle }}>Player</Text> */}

          {/* <Text style={{ ...$scoreColStyle, ...$tableHeadStyle }}>Leaves</Text> */}
        </View>
        {renderLeaderboard()}
      </View>
    </Screen>
  )
})

const $tableRow: ViewStyle = {
  width: "100%",
  flexDirection: "row",

  // backgroundColor: "blue"
  // borderRadius: 50,
  // borderWidth: 2,
  // borderColor: "#a3f632",
  // padding: spacing.md,
  paddingVertical: spacing.sm,
  marginVertical: spacing.sm,
}

const $userTableRow: ViewStyle = {
  ...$tableRow,
  backgroundColor: colors.scannerInfoBox,
  borderRadius: 16,
}
const $tableHeadStyle: TextStyle = {
  fontSize: 16,
  color: colors.palette.neutral100,
  // padding: spacing.md,
}

const $tableRowEntryStyle: TextStyle = {
  fontFamily: typography.fonts.poppins.bold,
  fontSize: 20,
  color: colors.palette.neutral800,
  // backgroundColor: "blue",
  paddingVertical: 6,
}

const $positionColStyle: TextStyle = {
  width: "16%",
  textAlign: "center",
  // backgroundColor: "red",
}

const $userNameColStyle: TextStyle = {
  width: "60%",
}

const $scoreColStyle: TextStyle = {
  textAlign: "center",
  width: "20%",
}
const $scoreColContainer: ViewStyle = {
  ...$scoreColStyle,
  // borderRadius: 30,
  // borderColor: "#a3f632",
  // borderWidth: 2,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",

  // backgroundColor: "blue",
}

const $scoreColEntryTextOnlyStyle: TextStyle = {
  fontFamily: typography.fonts.poppins.semiBold,
  color: "white",
  textAlign: "center",
}
