import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { $rootScreen, $title, colors, spacing, typography } from "app/theme"
import { leaderboardServiceInstance } from "app/services/Leaderboard"
import { useStores } from "app/models"
import Leaf from "app/components/Svg/Leaf"
import GoldMedal from "app/components/Svg/GoldMedal"
import SilverMedal from "app/components/Svg/SilverMedal"
import BronzeMedal from "app/components/Svg/BronzeMedal"
import {
  $positionColStyle,
  $medalStyle,
  $tableRowUsernameAndIndexStyle,
  $userTableRow,
  $tableRowContainer,
  $userNameColStyle,
  $scoreColContainer,
  $scoreColEntryTextOnlyStyle,
} from "./LeaderboardScreen.styles"
import useLeaderboardData from "./useLeaderboardData"

interface LeaderboardScreenProps extends AppStackScreenProps<"Leaderboard"> {}

export const LeaderboardScreen: FC<LeaderboardScreenProps> = observer(function LeaderboardScreen() {
  const { leaderboardStore, debugStore, authenticationStore } = useStores()
  const { setLeaderboardData, sortedLeaderboardData } = useLeaderboardData()

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
      <Text
        preset="heading"
        text="You need to be signed in to use Leaderboard!"
        style={{ ...$title, fontSize: typography.fontSizes.h2 }}
      />
      <Button text="Sign In" onPress={() => authenticationStore.setAuthToken(undefined)} />
    </View>
  )

  const leaderboardScreenContent = (
    <>
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
    </>
  )

  useEffect(() => {
    ;(async () => {
      try {
        await leaderboardServiceInstance.waitForInitToComplete()

        let dummyData = await leaderboardServiceInstance.getDummyLeaderboardDataFromStorage()

        let userData = await leaderboardServiceInstance.getUserScoreAndUsernameFromStorage()

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
      {authenticationStore.authToken === "scannerOnly" ? notSignedIn : leaderboardScreenContent}
    </Screen>
  )
})
