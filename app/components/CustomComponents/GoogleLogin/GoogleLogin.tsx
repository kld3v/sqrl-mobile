import { useNavigation } from "@react-navigation/native"
import { Button, Icon } from "app/components"
import Config from "app/config"
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
        const redirectUrl = res.url
        const token = extractToken(redirectUrl)
        const username = extractUsername(redirectUrl)
        const shouldClose = extractShouldClose(redirectUrl)

        if (shouldClose) {
          WebBrowser.dismissBrowser(); // Close the browser if instructed by the backend
          return; // Stop further processing
        }

        if (token) {
          await authService.setToken("google_token", token)
          api.setIdentityToken(token)
          if (username) {
            setAuthUsername(username)
            setAuthToken(token)
          } else {
            navigation.navigate("Username")
          }
        } else {
          alert("Token invalid")
        }
      } else {
        alert("Failed to get Google token")
      }
    } catch (error) {
      alert("Failed to sign in, please try again")
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

  function extractShouldClose(url: string): boolean {
    const match = url.match(/[?&]shouldClose=true/)
    return !!match;
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
