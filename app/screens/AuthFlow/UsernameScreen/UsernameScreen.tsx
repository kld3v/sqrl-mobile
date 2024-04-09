import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, TextField, Button, AutoImage } from "app/components"
import { useStores } from "app/models"
import { colors, spacing, typography } from "app/theme"
import { assetService } from "app/services/Assets/AssetService"
import { api } from "app/services/api"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface UsernameScreenProps extends AppStackScreenProps<"Username"> {}

export const UsernameScreen: FC<UsernameScreenProps> = observer(function UsernameScreen() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const qrlaLogo = assetService.qrlaLogo
  const { height } = Dimensions.get("window")
  const imageSize = height < 700 ? 64 : 112
  const {
    authenticationStore: { setAuthUsername, authUsername, validationError },
  } = useStores()

  const error = isSubmitted ? validationError : "Errorrrrrrrr"

  function SubmitUsername() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    // Make a request to your server to get an authentication token.
    api.apisauce.post("/auth/username", { username: authUsername })
    // If successful, reset the fields and set the token.
    setIsSubmitted(false)
  }

  return (
    <Screen
      style={$root}
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$headerContainer}>
        <AutoImage source={qrlaLogo} style={{ width: imageSize, height: imageSize }} />

        <View style={{ width: "100%" }}>
          <Text
            testID="SignIn-heading"
            text="QR'la is better with a username!"
            preset="heading"
            style={$signInHeading}
          />
        </View>
      </View>
      <TextField
        value={authUsername}
        onChangeText={setAuthUsername}
        containerStyle={$textField}
        autoCorrect={false}
        placeholder="Username"
        helper={error}
        status={error ? "error" : undefined}
      />

      <Button text="Submit" onPress={SubmitUsername} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.lg,
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
