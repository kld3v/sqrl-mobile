import React, { FC, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { $rootScreen, $title, colors, spacing, typography } from "app/theme"
import { leaderboardServiceInstance } from "app/services/Leaderboard"
import { useStores } from "app/models"
import Leaf from "app/components/Svg/Leaf"
import GoldMedal from "app/components/Svg/GoldMedal"
import SilverMedal from "app/components/Svg/SilverMedal"
import BronzeMedal from "app/components/Svg/BronzeMedal"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface LeaderboardScreenProps extends AppStackScreenProps<"Leaderboard"> {}

type UserScore = {
  username: string
  score: number
  mult?: number
  isUser?: boolean
}

export const LeaderboardScreen: FC<LeaderboardScreenProps> = observer(function LeaderboardScreen() {
  // Pull in one of our MST stores
  const { leaderboardStore, debugStore, authenticationStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const [leaderboardData, setLeaderboardData] = useState<UserScore[]>([])

  const sortedLeaderboardData = useMemo(() => {
    // Copy the array before sorting to avoid mutating the original state
    const sortedData = [...leaderboardData].sort((a, b) => b.score - a.score)
    return sortedData
  }, [leaderboardData])

  const displayMedalOrRankNumber = (index: number): React.JSX.Element => {
    switch (index) {
      case 0:
        return (
          <View style={{ ...$positionColStyle }}>
            <GoldMedal style={$medalStyle} />
          </View>
        )
      case 1:
        return (
          <View style={{ ...$positionColStyle }}>
            <SilverMedal style={$medalStyle} />
          </View>
        )
      case 2:
        return (
          <View style={{ ...$positionColStyle }}>
            <BronzeMedal style={$medalStyle} />
          </View>
        )
      default:
        return (
          <Text style={{ ...$positionColStyle, ...$tableRowUsernameAndIndexStyle }}>
            {index + 1}{" "}
          </Text>
        )
    }
  }

  const renderLeaderboard = (): React.ReactNode => {
    return sortedLeaderboardData.map((el, index) => {
      return (
        <View key={el.username} style={el.isUser ? $userTableRow : $tableRowContainer}>
          {displayMedalOrRankNumber(index)}

          <View style={$userNameColStyle}>
            <Text
              style={{ ...$userNameColStyle, ...$tableRowUsernameAndIndexStyle }}
              text={el.username}
            />
          </View>

          <View style={$scoreColContainer}>
            <Text style={$scoreColEntryTextOnlyStyle} text={el.score.toString()} />
            <Leaf
              style={{
                marginLeft: 6,
                marginTop: -4,
              }}
            />
          </View>
        </View>
      )
    })
  }

  const notSignedIn = (
    <View>
      <Text preset="heading" text="You need to be signed in to use history!" style={$title} />
      <Button text="Sign In" onPress={() => authenticationStore.setAuthToken(undefined)} />
    </View>
  )

  if (authenticationStore.authToken === "scannerOnly") return notSignedIn

  useEffect(() => {
    ;(async () => {
      try {
        await leaderboardServiceInstance.waitForInitToComplete()
        let dummyData = await leaderboardServiceInstance.getDummyLeaderboardDataFromStorage()
        let userData = await leaderboardServiceInstance.getUserScoreAndUserNameFromStorage()
        if (!userData || !dummyData) return
        let userDataFormatted = {
          username: authenticationStore.authUsername,
          score: parseInt(userData.score),
          isUser: true,
        }
        let leaderboardData = [...dummyData, userDataFormatted]
        setLeaderboardData(leaderboardData)
      } catch (error) {
        console.log(error, "error setting the data for leaderboard - check leaderboard screen ")
        debugStore.addErrorMessage("something fucked up in leaderboard screen")
      }
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
        ></View>
        {renderLeaderboard()}
      </View>
    </Screen>
  )
})

const $tableRowContainer: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  paddingVertical: spacing.sm,
  marginVertical: spacing.sm,
  alignItems: "center",
}

const $userTableRow: ViewStyle = {
  ...$tableRowContainer,
  backgroundColor: colors.scannerInfoBox,
  borderRadius: 16,
}

const $tableHeadStyle: TextStyle = {
  fontSize: 16,
  color: colors.palette.neutral100,
}

const $tableRowUsernameAndIndexStyle: TextStyle = {
  fontFamily: typography.fonts.poppins.semiBold,
  fontSize: 20,
  color: colors.palette.neutral800,
}

const $positionColStyle: TextStyle = {
  width: "16%",
  textAlign: "center",
}

const $userNameColStyle: TextStyle = {
  width: "60%",
  flexDirection: "row",
  alignItems: "center",
}

const $scoreColStyle: TextStyle = {
  textAlign: "center",
  width: "20%",
}
const $scoreColContainer: ViewStyle = {
  ...$scoreColStyle,
  borderRadius: 30,
  borderColor: "#a3f632",
  borderWidth: 2,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  height: 40,
}

const $scoreColEntryTextOnlyStyle: TextStyle = {
  fontFamily: typography.fonts.poppins.semiBold,
  color: "white",
  textAlign: "center",
}

const $medalStyle = {
  transform: [{ scale: 1.6 }],
  marginLeft: 22,
  marginTop: 4,
}
