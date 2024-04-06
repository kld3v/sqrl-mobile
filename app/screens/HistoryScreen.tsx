import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Alert,
  ImageStyle,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
  ViewStyle,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, Icon, ListView, Screen, Text } from "app/components"
import { $rootScreen, $title } from "app/theme"
import * as WebBrowser from "expo-web-browser"
import Tick from "app/components/Svg/Tick"
import Cancel from "app/components/Svg/Cancel"
import { Scan } from "app/services/History/HistoryService.types"
import { historyService } from "app/services/History"
import LottieView from "lottie-react-native"
import HeartIcon from "app/components/CustomComponents/HeartIcon"

interface HistoryScreenProps extends AppStackScreenProps<"History"> {}

export const HistoryScreen: FC<HistoryScreenProps> = observer(function HistoryScreen() {
  const [history, setHistory] = useState<Scan[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchHistory = useCallback(async () => {
    setRefreshing(true)
    let res = await historyService.getTestHistory()
    if (res) {
      setHistory(res)
    }
    setRefreshing(false)
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [])

  const takeUserToScanUrl = (el: Scan) => async () => {
    if (el.trust_score > 500) {
      await WebBrowser.openBrowserAsync(el.url)
      return
    }
    Alert.alert(
      "Confirm Action", // Title of the dialog
      "Are you sure you want to do this? This QR was deemed unsafe.", // Message of the dialog
      [
        // Array of buttons
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: async () => await WebBrowser.openBrowserAsync(el.url) },
      ],
      { cancelable: false }, // The dialog is not cancelable outside of the buttons
    )
  }

  const sortedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) => new Date(b.date_and_time).getTime() - new Date(a.date_and_time).getTime(),
    )
  }, [history])

  const renderItem = ({ item, index }: { item: Scan; index: number }) => (
    // <Pressable key={index} style={$scanCard} onPress={takeUserToScanUrl(item)}>
    <Pressable key={index} style={$scanCard}>
      <Card
        style={{ paddingVertical: 16, paddingHorizontal: 16 }}
        heading={item.url.length > 36 ? `${item.url.substring(0, 36)}...` : item.url}
        headingStyle={{ color: "black", maxWidth: "90%", marginTop: 8 }}
        RightComponent={
          <View style={$iconContainer}>
            {item.trust_score > 500 ? (
              <>
                <Tick style={$iconStyle} />
                <HeartIcon onPress={() => console.log("click")} />
              </>
            ) : (
              <Cancel style={$iconStyle} />
            )}
          </View>
        }
        RightComponentStyle={{ justifyContent: "center", alignItems: "center" }}
        footer={item.date_and_time}
        footerStyle={{ color: "black", marginBottom: 8 }}
      />
    </Pressable>
  )

  const noHistory = (
    <View>
      <Text style={{ textAlign: "center" }} preset="subheading" text="No history yet" />
      <Text style={{ textAlign: "center" }} preset="subheading" text="Get Scanning!" />
    </View>
  )

  return (
    <Screen style={$rootScreen} preset="fixed" safeAreaEdges={["top", "bottom"]}>
      <Text preset="heading" tx="historyScreen.title" style={$title} />

      {history.length === 0 && noHistory}
      {refreshing && <Text style={{ textAlign: "center" }}>Loading...</Text>}

      <View style={{ width: "100%", height: "90%" }}>
        <ListView
          data={sortedHistory}
          renderItem={renderItem}
          estimatedItemSize={200}
          keyExtractor={(item, index) => `history-${index}`}
          onRefresh={fetchHistory}
          refreshing={refreshing}
        />
      </View>
    </Screen>
  )
})

const $scanCard: ViewStyle = {
  marginVertical: 16,
}

const $iconStyle: ImageStyle = {
  transform: [{ scale: 0.8 }],
  // backgroundColor: "blue",
} as const

const $iconContainer: ViewStyle = {
  // backgroundColor: "black",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
}
