import { Button, Icon } from "app/components"
import config from "app/config"
import { colors, typography } from "app/theme"
import * as WebBrowser from "expo-web-browser"

export default function GoogleLogin() {
  const openGoogleAuth = async () => {
    try {
      await WebBrowser.openAuthSessionAsync(config.GOOGLE_AUTH_URL)
    } catch (error) {
      console.log("Error logging in with google")
    }
  }
  return (
    <Button
      text="Continue with Google"
      style={{
        backgroundColor: "white",
        borderRadius: 50,
        borderWidth: 0,
        padding: 0,
      }}
      pressedStyle={{
        backgroundColor: colors.palette.neutral900,
      }}
      textStyle={{
        fontSize: 14,
        color: "black",
        fontFamily: typography.Poppins.medium,
      }}
      LeftAccessory={(props) => (
        <Icon style={{ marginRight: 6, marginBottom: 2 }} size={12} icon="google" />
      )}
      onPress={openGoogleAuth}
    />
  )
}
