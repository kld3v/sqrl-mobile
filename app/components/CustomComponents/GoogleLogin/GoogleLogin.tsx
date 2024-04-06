import { Button } from "app/components"
import config from "app/config"
import * as WebBrowser from "expo-web-browser"

export default function GoogleLogin() {
  const openGoogleAuth = async () => {
    try {
      await WebBrowser.openAuthSessionAsync(config.GOOGLE_AUTH_URL)
    } catch (error) {
      console.log("Error logging in with google")
    }
  }
  return <Button text="Login with Google" onPress={openGoogleAuth} />
}
