import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React, { useEffect } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { ScanScreen } from "../screens/ScanScreen/ScanScreen"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { locationService } from "app/services/Location"
import { useStores } from "app/models"
import { HistoryScreen, LeaderboardScreen, ProfileScreen } from "app/screens"
import * as Haptics from "expo-haptics"

export type TabParamList = {
  Community: undefined
  Map: { queryIndex?: string; itemIndex?: string }
  MarketPlace: undefined
  Scan: undefined
  Debug: undefined
  Testing: undefined
  Leaderboard: undefined
  History: undefined
  Profile: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<TabParamList>()

export function MainNavigator() {
  const { bottom } = useSafeAreaInsets()
  const iconSize = 42
  const { locationStore } = useStores()

  useEffect(() => {
    ;(async () => {
      await locationService.requestPermission()
      locationStore.setPermission()
      await locationStore.getAndSetCurrentPosition()
    })()
  }, [])

  return (
    <Tab.Navigator
      initialRouteName="Scan"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: "",
          tabBarAccessibilityLabel: "history tab",
          tabBarIcon: ({ focused }) => (
            <Icon icon="history" color={focused ? colors.tint : colors.text} size={iconSize} />
          ),
        }}
        listeners={{
          focus: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: "",
          tabBarAccessibilityLabel: translate("navigator.scannerTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="qrCode" color={focused ? colors.tint : colors.text} size={iconSize} />
          ),
        }}
        listeners={{
          focus: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: "",
          tabBarAccessibilityLabel: translate("navigator.scannerTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="leaderboard" color={focused ? colors.tint : colors.text} size={iconSize} />
          ),
        }}
        listeners={{
          focus: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "", // Hides the label
          tabBarIcon: () => null, // Hides the icon
          tabBarButton: (props) => null, // Disables the tab button
          tabBarAccessibilityLabel: "None", // Accessibility label set to 'None'
        }}
        listeners={{
          focus: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.palette.mattColorsBlue,
  borderTopWidth: 3,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
