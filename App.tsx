import App from "./app/app"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return (
    <>
      <StatusBar style="light" />
      <App hideSplashScreen={SplashScreen.hideAsync} />
    </>
  )
}

export default IgniteApp
