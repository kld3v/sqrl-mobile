import React, { FC, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, ImageStyle, Pressable, ScrollView, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, ListView, Screen, Text } from "app/components"
import { $rootScreen, $title } from "app/theme"
import * as WebBrowser from "expo-web-browser"
import Tick from "app/components/Svg/Tick"
import Cancel from "app/components/Svg/Cancel"
import { Scan } from "app/services/HistoryService/HistoryService.types"
import { historyService } from "app/services/HistoryService"

interface HistoryScreenProps extends AppStackScreenProps<"History"> {}

export const HistoryScreen: FC<HistoryScreenProps> = observer(function HistoryScreen() {
  const [history, setHistory] = useState<Scan[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchHistory = async () => {
    setRefreshing(true)
    // Fetch history data
    let res = await historyService.getHistory()
    console.log(res)
    if (res) {
      setHistory(res)
    }
    setRefreshing(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const takeUserToScanUrl = (el: Scan) => async () => {
    if (el.trust_score > 500) {
      await WebBrowser.openBrowserAsync(el.url)
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
    <Pressable key={index} style={$scanCard} onPress={() => takeUserToScanUrl(item)}>
      <Card
        style={{ padding: 16, position: "relative" }}
        heading={item.url.length > 48 ? `${item.url.substring(0, 48)}...` : item.url}
        headingStyle={{ color: "black", maxWidth: "80%" }}
        RightComponent={
          item.trust_score > 500 ? <Tick style={$iconStyle} /> : <Cancel style={$iconStyle} />
        }
        RightComponentStyle={{ justifyContent: "center", alignItems: "center" }}
        footer={item.date_and_time}
        footerStyle={{ color: "black" }}
      />
    </Pressable>
  )

  const noHistory = (
    <View>
      <Text preset="heading" text="No history - Get Scanning" />
    </View>
  )

  const loading = (
    <View>
      <Text preset="heading" style={{ textAlign: "center" }} text="Loading..." />
    </View>
  )

  return (
    <Screen style={$rootScreen} preset="fixed" safeAreaEdges={["top", "bottom"]}>
      <Text preset="heading" tx="historyScreen.title" style={$title} />

      {history.length === 0 && noHistory}
      {refreshing && loading}

      <View style={{ width: "100%", height: "80%" }}>
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

const $root: ViewStyle = {
  flex: 1,
}

const $scanCard: ViewStyle = {
  marginVertical: 8,
}

const $iconStyle: ImageStyle = {
  position: "absolute",
  top: 0,
  bottom: 0,
  transform: [{ scale: 1.3 }],
} as const
