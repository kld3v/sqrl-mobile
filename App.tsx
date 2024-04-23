import App from "./app/app"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import "expo-dev-client"

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return (
    <>
      <App hideSplashScreen={SplashScreen.hideAsync} />
    </>
  )
}

export default IgniteApp
