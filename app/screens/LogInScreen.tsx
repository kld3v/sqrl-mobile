import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import {
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
  Button,
  AutoImage,
} from "app/components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { colors, spacing, typography } from "app/theme"
import { assetService } from "app/services/Assets/AssetService"
import { api } from "app/services/api"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface LogInProps extends AppStackScreenProps<"LogIn"> {}

export const LogIn: FC<LogInProps> = observer(function LogIn() {
  const navigation = useNavigation()
  const authPasswordInput = useRef<TextInput>(null)
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [password, setPassword] = useState("")

  const qrlaLogo = assetService.qrlaLogo
  const { height } = Dimensions.get("window")
  const imageSize = height < 700 ? 64 : 112
  const {
    authenticationStore: { authEmail, setAuthEmail, authUsername, setAuthToken, validationError },
  } = useStores()

  useEffect(() => {
    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setPassword("")
      setAuthEmail("")
    }
  }, [])

  const error = isSubmitted ? validationError : ""

  async function LogIn() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    // Make a request to your server to get an authentication token.
    let res = await api.apisauce.post("/auth/login", {
      email: authEmail,
      password,
    })

    // If successful, reset the fields and set the token.
    setIsSubmitted(false)
    setPassword("")
    setAuthEmail("")

    // We'll mock this with a fake token.
    setAuthToken(String(Date.now()))
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

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
          <Text text="Welcome Back" preset="heading" style={$signInHeading} />
        </View>
      </View>
      {attemptsCount > 2 && <Text tx="SignInScreen.hint" size="sm" weight="light" style={$hint} />}
      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="Email"
        helper={error}
        status={error ? "error" : undefined}
      />

      <TextField
        ref={authPasswordInput}
        value={password}
        onChangeText={setPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        placeholder="Password"
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        text="Log In"
        //@ts-ignore
        onPress={LogIn}
      />
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

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
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
