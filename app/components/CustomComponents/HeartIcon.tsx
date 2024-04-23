import React, { useCallback, useState } from "react"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"
import { View, StyleSheet } from "react-native"
import { Icon } from "../Icon" // Ensure proper import path
import { colors } from "app/theme" // Ensure proper import path
import { Scan, historyService } from "app/services/History"

const ICON_SIZE = 36

const HeartIcon: React.FC<{
  setHistory: React.Dispatch<React.SetStateAction<Scan[]>>
  isFavorite: boolean
  url_id: number
  timestamp: string
}> = ({ setHistory, url_id, isFavorite, timestamp }) => {
  const scale = useSharedValue(1)

  const setFavoriteStatus = async (id: number, isFave: boolean) => {
    if (!isFave) {
      await historyService.addToFavorite(id)
    } else {
      await historyService.deleteFavorite(id)
    }
  }
  const handlePress = useCallback(async () => {
    // Heart animation

    setHistory((currentHistory) =>
      currentHistory.map((item) =>
        item.url_id === url_id && item.date_and_time === timestamp
          ? { ...item, is_favorite: !item.is_favorite }
          : item,
      ),
    )
    scale.value = withSpring(isFavorite ? 1 : 1.2, { damping: 5, stiffness: 150 }, () => {
      scale.value = withSpring(1)
    })
    await setFavoriteStatus(url_id, isFavorite)
  }, [isFavorite])

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.heartContainer, heartAnimatedStyle]}>
        <Icon
          onPress={handlePress}
          icon={isFavorite ? "heart" : "heart"}
          size={ICON_SIZE}
          color={isFavorite ? colors.palette.heartRed : colors.palette.neutral800}
        />
      </Animated.View>
    </View>
  )
}

export default HeartIcon

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  heartContainer: {
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
  sparkle: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "gold",
    borderRadius: 5,
    top: "50%",
    left: "50%",
  },
})
