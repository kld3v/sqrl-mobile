import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, Pressable, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, Screen, Text } from "app/components"
import { $rootScreen, $title } from "app/theme"
import * as WebBrowser from "expo-web-browser"

interface HistoryScreenProps extends AppStackScreenProps<"History"> {}

type Scan = {
  url: string
  date_and_time: string
  trust_score: number
}
export const HistoryScreen: FC<HistoryScreenProps> = observer(function HistoryScreen() {
  const showConfirmationDialog = () => {
    Alert.alert(
      "Confirm Action", // Title of the dialog
      "Are you sure you want to do this?", // Message of the dialog
      [
        // Array of buttons
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: async () => await WebBrowser.openBrowserAsync("https://qrla.io") },
      ],
      { cancelable: false }, // The dialog is not cancelable outside of the buttons
    )
  }

  const [history, setHistory] = useState<Scan[]>([
    {
      url: "https://google.com/",
      date_and_time: "2024-02-29 17:41:11",
      trust_score: 500,
    },
    {
      url: "https://www.toy.org/qui-cumque-est-culpa-et",
      date_and_time: "2024-03-04 11:45:23",
      trust_score: 642,
    },
    {
      url: "http://www.turner.org/delectus-est-ut-asperiores-numquam-quisquam.html",
      date_and_time: "2024-03-04 11:45:25",
      trust_score: 346,
    },
    {
      url: "http://durgan.com/",
      date_and_time: "2024-03-04 11:45:25",
      trust_score: 1000,
    },
    {
      url: "http://kemmer.com/laudantium-quo-quo-soluta-enim-debitis",
      date_and_time: "2024-03-04 11:45:26",
      trust_score: 432,
    },
    {
      url: "http://www.barton.com/",
      date_and_time: "2024-03-04 11:45:26",
      trust_score: 730,
    },
    {
      url: "http://www.schuster.com/et-dignissimos-a-quis-minus-laudantium-blanditiis.html",
      date_and_time: "2024-03-04 11:45:26",
      trust_score: 230,
    },
    {
      url: "http://www.wyman.biz/",
      date_and_time: "2024-03-04 11:45:26",
      trust_score: 369,
    },
    {
      url: "http://schmitt.com/",
      date_and_time: "2024-03-04 11:45:26",
      trust_score: 570,
    },
    {
      url: "https://www.waelchi.com/accusantium-numquam-nihil-accusantium-molestiae",
      date_and_time: "2024-03-04 11:45:26",
      trust_score: 1000,
    },
    {
      url: "http://lemke.com/cum-qui-consectetur-qui-reiciendis-magni-ut",
      date_and_time: "2024-03-04 11:45:29",
      trust_score: 136,
    },
    {
      url: "https://www.google.com",
      date_and_time: "2024-03-12 12:22:49",
      trust_score: 500,
    },
  ])

  const qrHistory = (): React.ReactNode => {
    return history.map((el, index) => {
      return (
        <Pressable key={index} style={$scanCard} onPress={showConfirmationDialog}>
          <Card heading={el.url} headingStyle={{ color: "black" }} />
        </Pressable>
      )
    })
  }

  return (
    <Screen style={$rootScreen} preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Text preset="heading" tx="historyScreen.title" style={$title} />
      {qrHistory()}
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $scanCard: ViewStyle = {
  marginVertical: 8,
}
