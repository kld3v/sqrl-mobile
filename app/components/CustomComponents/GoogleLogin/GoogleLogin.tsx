import { useNavigation } from "@react-navigation/native"
import { Button, Icon } from "app/components"

import { useStores } from "app/models"
import { authService } from "app/services/Auth"
import { api } from "app/services/api"
import { colors, typography } from "app/theme"
import * as WebBrowser from "expo-web-browser"
import { useEffect, useState } from "react"
import * as Google from "expo-auth-session/providers/google"
import { AuthAPIResponse, OAuthApiErrorResponse } from "app/screens/AuthFlow/Auth.types"

WebBrowser.maybeCompleteAuthSession()

export default function GoogleLogin() {
  const navigation = useNavigation()

  const {
    authenticationStore: { setAuthToken, setAuthUsername, setAuthError },
  } = useStores()

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "262749291664-fe269s3him1mn6kk9hsd8aglhrid5ncp.apps.googleusercontent.com",
  })

  const handleGoogleSignIn = async () => {
    console.log(response)
    if (response?.type !== "success") {
      setAuthError("Failed To Login with Google")
      return
    }

    let identity_token = response.authentication?.accessToken

    if (!identity_token) {
      setAuthError("Invalid token from Google :((")
      return
    }

    let res: AuthAPIResponse = await api.auth.post("/google/signin", {
      identity_token,
    })

    if (!res.ok || !res.data) {
      setAuthError("Failed to talk to Qrla HQ, please try again later. Sorry. ")
      return
    }

    if (res.ok && !res.data?.token) {
      setAuthError("Invalid token from QRLA :((")
      return
    }

    const { token } = res.data
    await authService.setToken("google_token", token)
    api.setIdentityToken(token)

    if (res.ok && !res.data?.username) {
      //@ts-ignore
      navigation.navigate("Username")
      return
    }

    if (res.ok && res.data) {
      setAuthUsername(res.data?.username)
      //Takes user to main tabs
      setAuthToken(identity_token)
    }
  }

  useEffect(() => {
    handleGoogleSignIn()
    setAuthError("")
  }, [response])

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
      onPress={() => promptAsync()}
      preset="defaultNoLift"
    />
  )
}
