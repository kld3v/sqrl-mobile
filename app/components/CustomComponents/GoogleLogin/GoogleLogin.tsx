import { useNavigation } from "@react-navigation/native"
import { Button, Icon } from "app/components"
import Config from "app/config"
import config from "app/config"
import { useStores } from "app/models"
import { authService } from "app/services/Auth"
import { api } from "app/services/api"
import { colors, typography } from "app/theme"
import * as WebBrowser from "expo-web-browser"

export default function GoogleLogin() {
  const navigation = useNavigation()
  const {
    authenticationStore: { setAuthToken, setAuthUsername },
  } = useStores()
  const openGoogleAuth = async () => {
    try {
      const res = await WebBrowser.openAuthSessionAsync(
        Config.GOOGLE_AUTH_URL,
        "qrla://app.qrla.io/auth/google",
        {
          dismissButtonStyle: "done",
        },
      )

      console.log("google login", res)
      if (res.type === "success") {
        // Assuming the token is directly in the URI query parameters
        const redirectUrl = res.url
        const token = extractToken(redirectUrl)
        const username = extractUsername(redirectUrl)
        // Use the token as needed

        if (token) {
          await authService.setToken("google_token", token)
          api.setIdentityToken(token)
          if (username) {
            setAuthUsername(username)
            setAuthToken(token)
          } else {
            //@ts-ignore
            navigation.navigate("Username")
          }
        } else {
          alert("token invalid")
        }
      } else {
        alert("Failed to get Google token")
      }
    } catch (error) {
      alert("failed to sign in, please try again")
      console.error("An error occurred during authentication", error)
    }
  }

  function extractUsername(url: string): string | null {
    const match = url.match(/[?&]username=([^&]*)/)
    return match && match.length > 1 ? decodeURIComponent(match[1]) : null
  }

  function extractToken(url: string): string | null {
    const matches = url.match(/[?&]token=([^&#]*)/)
    return matches && matches.length > 1 ? decodeURIComponent(matches[1]) : null
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
