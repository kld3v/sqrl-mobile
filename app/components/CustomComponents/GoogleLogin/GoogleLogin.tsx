import { useNavigation } from "@react-navigation/native"
import { Button, Icon } from "app/components"
import Config from "app/config"
import config from "app/config"
import { useStores } from "app/models"
import { authService } from "app/services/Auth"
import { api } from "app/services/api"
import { colors, typography } from "app/theme"
import * as WebBrowser from "expo-web-browser"
import * as AuthSession from "expo-auth-session"
import { useEffect, useState } from "react"
import { Linking } from "react-native"
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"

export default function GoogleLogin() {
  const navigation = useNavigation()
  const [state, setState] = useState({})
  const {
    authenticationStore: { setAuthToken, setAuthUsername },
  } = useStores()
  const openGoogleAuth = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      setState({ userInfo, error: undefined })
    } catch (error) {
      if (error) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            break
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            break
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
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
