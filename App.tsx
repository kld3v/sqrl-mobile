import App from "./app/app"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import * as Sentry from "@sentry/react-native"
SplashScreen.preventAutoHideAsync()

Sentry.init({
  dsn: "https://684a960b587d4dd7b0bba4bc9e86dfa9@o4506973425303552.ingest.us.sentry.io/4506973441687552",
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
})

function IgniteApp() {
  return (
    <>
      <App hideSplashScreen={SplashScreen.hideAsync} />
    </>
  )
}

export default Sentry.wrap(IgniteApp)
