import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, ImageStyle, Pressable, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, ListView, Screen, Text, Toggle } from "app/components"
import { $rootScreen, $title, colors } from "app/theme"
import * as WebBrowser from "expo-web-browser"
import Tick from "app/components/Svg/Tick"
import Cancel from "app/components/Svg/Cancel"
import { Scan } from "app/services/History/HistoryService.types"
import { historyService } from "app/services/History"
import HeartIcon from "app/components/CustomComponents/HeartIcon"
import { useStores } from "app/models"
import { authService } from "app/services/Auth"
import { PanGestureHandler } from "react-native-gesture-handler"
import useCustomSwiper from "app/utils/useCustomSwiper"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import * as Haptics from "expo-haptics"
import { LinearGradient } from "expo-linear-gradient"

interface HistoryScreenProps extends AppStackScreenProps<"History"> {}

export const HistoryScreen: FC<HistoryScreenProps> = observer(function HistoryScreen() {
  const [history, setHistory] = useState<Scan[]>([])
  const [favorites, setFavorites] = useState<Scan[]>([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { authenticationStore } = useStores()
  const navigation = useNavigation()
  const { onSwipeEvent } = useCustomSwiper({ onSwipeLeft: () => navigation.navigate("Scan") })

  const fetchHistory = useCallback(async () => {
    setRefreshing(true)
    console.log(authService.validToken)
    console.log("token exists??", await authService.tokenDoesExist())

    // Get user history and set
    let historyResponse = await historyService.getHistory()
    console.log(historyResponse)
    if (historyResponse) {
      setHistory(historyResponse)
    }

    // Get user favorites only and set
    let favoritesResponse = await historyService.getFavouriteHistory()
    console.log(favoritesResponse)
    if (favoritesResponse) {
      setFavorites(favoritesResponse)
    }

    setRefreshing(false)
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      fetchHistory()
    }, []),
  )

  useFocusEffect(
    React.useCallback(() => {
      fetchHistory()
    }, []),
  )

  const curried_takeUserToScanUrl = (el: Scan) => async () => {
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
    // Filter the history based on the favoritesOnly flag.
    // let filteredHistory
    // if (favoritesOnly) {
    //   // Create a Set to track seen URLs when favoritesOnly is true.
    //   const seenUrls = new Set()

    //   // Filter out non-favorite items and check for duplicates.
    //   filteredHistory = history.filter((item) => {
    //     return item.is_favorite && (!seenUrls.has(item.url) ? seenUrls.add(item.url) : false)
    //   })
    // } else {
    //   // If favoritesOnly is not true, use the entire history without filtering for duplicates.
    //   filteredHistory = history
    // }

    if (favoritesOnly) {
      return favorites.sort(
        (a, b) => new Date(b.date_and_time).getTime() - new Date(a.date_and_time).getTime(),
      )
    }

    return history.sort(
      (a, b) => new Date(b.date_and_time).getTime() - new Date(a.date_and_time).getTime(),
    )
  }, [history, favoritesOnly])

  const renderItem = ({ item }: { item: Scan }) => (
    <Pressable
      key={`${item.url_id}+${item.date_and_time}`}
      style={$scanCard}
      onPress={curried_takeUserToScanUrl(item)}
    >
      <Card
        style={{ paddingVertical: 16, paddingHorizontal: 16 }}
        heading={item.url.length > 36 ? `${item.url.substring(0, 36)}...` : item.url}
        headingStyle={{ color: "black", maxWidth: "90%", marginTop: 8 }}
        RightComponent={
          <View style={$iconContainer}>
            {item.trust_score > 500 ? <Tick style={$iconStyle} /> : <Cancel style={$iconStyle} />}
            <HeartIcon
              setHistory={setHistory}
              url_id={item.url_id}
              timestamp={item.date_and_time}
              isFavorite={item.is_favorite}
            />
          </View>
        }
        RightComponentStyle={{ justifyContent: "center", alignItems: "center" }}
        footer={`${item.date_and_time} by ${item.scan_type}`}
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

  const notSignedIn = (
    <View style={{ alignItems: "center" }}>
      <Text preset="heading" text="You need to be signed in to use history!" style={$title} />
      <View style={{ width: "80%" }}>
        <Button text="Sign In" onPress={() => authenticationStore.setAuthToken(undefined)} />
      </View>
    </View>
  )

  const renderHistory = (
    <>
      <Text preset="heading" tx="historyScreen.title" style={$title} />
      <Toggle
        value={favoritesOnly}
        onValueChange={() => {
          fetchHistory()
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          setFavoritesOnly(!favoritesOnly)
        }}
        variant="switch"
        label="Show Favourites Only"
        labelPosition="left"
        labelStyle={{
          textAlign: "right",
        }}
      />

      {history.length === 0 && noHistory}
      {refreshing && <Text style={{ textAlign: "center" }}>Loading...</Text>}

      <View style={{ width: "100%", height: "80%" }}>
        <ListView
          data={sortedHistory}
          renderItem={renderItem}
          estimatedItemSize={200}
          keyExtractor={(item) => `history-${item.url_id}-${item.date_and_time}`}
          onRefresh={fetchHistory}
          refreshing={refreshing}
        />
      </View>
    </>
  )

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <Screen style={$rootScreen} preset="fixed" safeAreaEdges={["top", "bottom"]}>
      <PanGestureHandler onHandlerStateChange={onSwipeEvent} activeOffsetX={[-10, 10]}>
        <View style={{ height: "100%" }}>
          <LinearGradient
            // Background Linear Gradient
            colors={["transparent", colors.palette.overlay50]}
            style={{
              position: "absolute",
              left: -24,
              right: 0,
              top: 0,
              width: "200%",
              height: "150%",
            }}
          />
          {authenticationStore.authToken === "scannerOnly" ? notSignedIn : renderHistory}
        </View>
      </PanGestureHandler>
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
