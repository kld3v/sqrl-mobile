import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, useNavigation } from "@react-navigation/native"
import React, { useEffect } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { CommunityScreen, DebugScreen, MarketPlaceScreen } from "../screens"
import { ScanScreen } from "../screens/ScanScreen"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type TabParamList = {
  Community: undefined
  Map: { queryIndex?: string; itemIndex?: string }
  MarketPlace: undefined
  Scan: undefined
  Debug: undefined
  Testing: undefined
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

export function Navigator() {
  const { bottom } = useSafeAreaInsets()
  const iconSize = 42

  const navigation = useNavigation()
  useEffect(() => {
    // Why on earth is the ...args param typed as never?
    // Implemented because initialRouteName is not working as expected.🐨

    navigation.navigate("Scan")
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
      {/* <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: translate("navigator.mapTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="pin" color={focused ? colors.tint : colors.text} size={iconSize} />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: "",
          tabBarAccessibilityLabel: translate("navigator.communityTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="community" color={focused ? colors.tint : colors.text} size={iconSize} />
          ),
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
      />

      <Tab.Screen
        name="MarketPlace"
        component={MarketPlaceScreen}
        options={{
          tabBarLabel: "",
          tabBarAccessibilityLabel: translate("navigator.marketPlaceTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="shoppingCart" color={focused ? colors.tint : colors.text} size={iconSize} />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Debug"
        component={DebugScreen}
        options={{
          tabBarLabel: "",
          tabBarAccessibilityLabel: translate("navigator.debugTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="face" color={focused ? colors.tint : colors.text} size={56} />
          ),
        }}
      /> */}
      {/* {__DEV__ && (
        <Tab.Screen
          name="Testing"
          component={TestingScreen}
          options={{
            tabBarLabel: translate("navigator.pushTab"),
            tabBarIcon: ({ focused }) => (
              <Icon icon="lock" color={focused ? colors.tint : colors.text} size={iconSize} />
            ),
          }}
        />
      )} */}
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
