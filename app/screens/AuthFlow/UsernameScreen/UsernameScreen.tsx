import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, TextField, Button, AutoImage } from "app/components"
import { useStores } from "app/models"
import { $ScreenStyle, $hint, colors, spacing, typography } from "app/theme"
import { assetService } from "app/services/Assets/AssetService"
import { api } from "app/services/api"
import { authService } from "app/services/Auth"
import LoadingOverlay from "app/components/LoadingOverlay"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface UsernameScreenProps extends AppStackScreenProps<"Username"> {}

export const UsernameScreen: FC<UsernameScreenProps> = observer(function UsernameScreen() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [error, setError] = useState("")
  const qrlaLogo = assetService.qrlaLogo
  const { height } = Dimensions.get("window")
  const imageSize = height < 700 ? 64 : 112
  const {
    authenticationStore: { setAuthUsername, authUsername, usernameValidationError, setAuthToken },
  } = useStores()

  const usernameError = isSubmitted ? usernameValidationError : ""

  async function SubmitUsername() {
    setIsSubmitted(true)
    setIsLoading(true)
    setAttemptsCount(attemptsCount + 1)
    api.setIdentityToken("90|NF6RaHfg9W9vwcvwwCaHVF4ZgqoCorMA7FoTIh1P3030b303")

    if (usernameValidationError) {
      setIsLoading(false)
      return
    }

    let res = await api.apisauce.post("/user/update-username", {
      username: authUsername,
    })

    if (!res.ok) {
      console.log(res)
      res.data?.error
        ? setError(res.data?.error)
        : setError("Error setting username - please try again!")
      setIsLoading(false)
    } else {
      await authService.setUsername(authUsername)
      // Setting the authtoken in global state below is key as this is what tells react to render the logged in user state.
      let token = authService.validToken
      if (token) setAuthToken(token)
      setIsLoading(false)
      setIsSubmitted(false)
    }
  }

  return (
    <Screen contentContainerStyle={$ScreenStyle} preset="auto" safeAreaEdges={["top", "bottom"]}>
      {isLoading && <LoadingOverlay />}
      <View style={$screenContentContainer}>
        <View style={$headerContainer}>
          <AutoImage source={qrlaLogo} style={{ width: imageSize, height: imageSize }} />

          <View style={{ width: "100%" }}>
            <Text
              testID="SignIn-heading"
              text="QRLA is better with a username!"
              preset="heading"
              style={$signInHeading}
            />
          </View>
        </View>
        {error && <Text text={error} size="sm" weight="light" style={$hint} />}
        <TextField
          value={authUsername}
          onChangeText={setAuthUsername}
          containerStyle={$textField}
          autoCorrect={false}
          placeholder="Username"
          helper={usernameError}
          status={usernameError ? "error" : undefined}
        />

        <Button text="Submit" onPress={SubmitUsername} />
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.xl,
  height: "100%",
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}
const $headerContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  // backgroundColor: "red",
  width: "100%",
}
const $signInHeading: TextStyle = {
  // lineHeight: 48,
  // backgroundColor: "blue",
  textAlign: "center",
  // width: "100%",
  paddingTop: 8,
  marginVertical: spacing.xl2,
  fontSize: typography.fontSizes.h2,
  color: colors.palette.neutral100,
}
