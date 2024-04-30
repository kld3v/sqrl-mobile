import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { $ScreenStyle, $rootScreen, $title, colors, spacing, typography } from "app/theme"
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
import useCustomSwiper from "app/utils/useCustomSwiper"
import { useNavigation } from "@react-navigation/native"
import { PanGestureHandler } from "react-native-gesture-handler"

interface LeaderboardScreenProps extends AppStackScreenProps<"Leaderboard"> {}

export const LeaderboardScreen: FC<LeaderboardScreenProps> = observer(function LeaderboardScreen() {
  const { leaderboardStore, debugStore, authenticationStore } = useStores()
  const { setLeaderboardData, sortedLeaderboardData } = useLeaderboardData()
  const [error, setError] = useState("")
  const navigation = useNavigation()
  const { onSwipeEvent } = useCustomSwiper({ onSwipeRight: () => navigation.navigate("Scan") })

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
            <Text style={{ ...$tableRowUsernameAndIndexStyle, width: "90%" }} text={el.username} />
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
    <View style={{ alignItems: "center" }}>
      <Text
        preset="heading"
        text="You need to be signed in to use the leaderboard!"
        style={$title}
      />
      <View style={{ width: "80%" }}>
        <Button text="Sign In" onPress={() => authenticationStore.setAuthToken(undefined)} />
      </View>
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

        let score = await leaderboardServiceInstance.getUserScoreFromStorage()

        if (!dummyData) {
          await leaderboardServiceInstance.init()
          dummyData = await leaderboardServiceInstance.getDummyLeaderboardDataFromStorage()

          if (!dummyData) {
            setError("Failed to get leaderboard data :(")
            return
          }
        }

        if (!score) {
          await leaderboardServiceInstance.initUserScoreInStorage()
          score = await leaderboardServiceInstance.getUserScoreFromStorage()

          if (!score) {
            debugStore.addErrorMessage(`userscore is: ${score}, failed to get user score`)
            score = ":("
          }
        }

        let userDataFormatted = {
          username: authenticationStore.authUsername,
          score: parseInt(score),
          isUser: true,
        }

        let leaderboardData = [...dummyData, userDataFormatted]

        setLeaderboardData(leaderboardData)
      } catch (error) {
        console.log(error, "error setting the data for leaderboard - check leaderboard screen ")
        debugStore.addErrorMessage(`something fucked up in leaderboard screen: ${error}`)
      }
    })()
  }, [leaderboardStore.userScore])

  return (
    <Screen style={$rootScreen} preset="scroll" safeAreaEdges={["top"]}>
      <PanGestureHandler onHandlerStateChange={onSwipeEvent} activeOffsetX={[-10, 10]}>
        <View style={{ flex: 1 }}>
          {authenticationStore.authToken === "scannerOnly" ? notSignedIn : leaderboardScreenContent}
          {error && <Text text={error} style={{ textAlign: "center" }} preset="subheading" />}
        </View>
      </PanGestureHandler>
    </Screen>
  )
})
