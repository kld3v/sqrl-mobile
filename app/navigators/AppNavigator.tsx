/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { useColorScheme } from "react-native"

import Config from "../config"
import { useStores } from "../models"
import { Navigator, TabParamList } from "./Navigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { locationService } from "app/services/Location/LocationService"
import * as Screens from "app/screens"
/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  Demo: NavigatorScreenParams<TabParamList>
  // 🔥 Your screens go here
  PushNotifications: undefined
  MarketPlace: undefined
  TermsAndConditions: undefined
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    authenticationStore: { isAuthenticated },
    locationStore,
  } = useStores()

  const checkIfUserHasSignedUpToDateContract = () => {
    // get signed version code from secure store
    // send to server to check if it's the latest version
    // if it's not, return the version the user needs to sign, and send user to the contract screen
    // 1. if user signs, update local storage and send version to server which will upon success, send user to QR scanner
    // 2. If user rejects terms, update contract page to say sorry but they cannot use the app without your consent.
    // if it is the latest version, proceed to QR scanner
  }

  const recurringlyUpdateLocation = async () => {
    try {
      await locationStore.getAndSetCurrentPosition()
    } catch (error) {
      console.error(`Failed to get location: ${error}`)
    }
    // console.log(locationStore.latitude, locationStore.longitude)
  }

  useEffect(() => {
    ;(async () => {
      try {
        await locationService.requestPermission()
        locationStore.setPermission()
        await locationStore.getAndSetCurrentPosition()
        setInterval(recurringlyUpdateLocation, 10000)
      } catch (error) {
        console.error(`Failed to get location: ${error}`)
      }
    })()
    // setInterval(recurringlyUpdateLocation, 10000)
  }, [])
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        navigationBarHidden: true,
      }}
      // initialRouteName={isAuthenticated ? "Welcome" : "Login"}
      initialRouteName="Demo"
    >
      <Stack.Screen name="Demo" component={Navigator} />

      {/* 
      For when authentication set up! 
      
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />

          <Stack.Screen name="Demo" component={Navigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Screens.LoginScreen} />
        </>
      )} */}

      {/** 🔥 Your screens go here */}
      {/* <Stack.Screen name="PushNotifications" component={Screens.TestingScreen} /> */}
      {/* <Stack.Screen name="MarketPlace" component={Screens.MarketPlaceScreen} /> */}
      <Stack.Screen name="TermsAndConditions" component={Screens.TermsAndConditionsScreen} />
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
