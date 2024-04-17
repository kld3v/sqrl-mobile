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
import { useStores } from "app/models"
import { $ScreenStyle, $hint, colors, spacing, typography } from "app/theme"
import { assetService } from "app/services/Assets/AssetService"
import { api } from "app/services/api"
import { AuthAPIResponse } from "../Auth.types"
import { authService } from "app/services/Auth"
import LoadingOverlay from "app/components/LoadingOverlay"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface RegistrationProps extends AppStackScreenProps<"Registration"> {}

export const Registration: FC<RegistrationProps> = observer(function Registration() {
  const authPasswordInput = useRef<TextInput>(null)
  const authPasswordConfirmInput = useRef<TextInput>(null)
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  const qrlaLogo = assetService.qrlaLogo
  const { height } = Dimensions.get("window")
  const imageSize = height < 700 ? 64 : 112
  const {
    authenticationStore: {
      authEmail,
      setAuthEmail,
      authUsername,
      setAuthUsername,
      setAuthToken,
      authError,
      setAuthError,
      usernameValidationError,
      emailValidationError,
    },
  } = useStores()

  useEffect(() => {
    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setPassword("")
      setAuthEmail("")
    }
  }, [])
  const emailError = isSubmitted ? emailValidationError : ""
  const usernameError = isSubmitted ? usernameValidationError : ""
  async function Register() {
    setIsSubmitted(true)
    setIsLoading(true)

    if (emailValidationError || usernameValidationError) {
      setIsLoading(false)
      return
    }
    if (password !== passwordConfirm) {
      setAuthError("Passwords don't match!")
      setIsLoading(false)
      return
    }
    if (password.length < 9) {
      setAuthError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    // Make a request to your server to get an authentication token.
    let res: AuthAPIResponse = await api.auth.post("/register", {
      username: authUsername,
      email: authEmail,
      password,
      password_confirmation: passwordConfirm,
    })

    // TODO Tidy up at some point
    if (!res.ok) {
      console.log(res)
      if (res.data?.errors) {
        let errorMessages = [] // Use an array to collect error messages
        let errorArray = res.data.errors

        // Iterate over properties in errors object
        for (let property in errorArray) {
          if (errorArray.hasOwnProperty(property)) {
            // Ensure the property is not from the prototype chain
            // Add the first error message of each property to the array
            errorMessages.push(errorArray[property][0])
          }
        }

        // Set the authentication error message
        // Join the array of messages into a single string, separated by a space or newline, depending on your preference
        const errorMessageString = errorMessages.join(". ") + "" // Ending with a period for proper punctuation
        setAuthError(
          errorMessageString.length > 0
            ? errorMessageString
            : "Something went wrong - please try again :)",
        )
      } else {
        // Handle case where there are no error messages in the expected format
        setAuthError("Something went wrong - please try again :)")
      }
      setIsLoading(false)
      return
    }

    if (res.data && res.data.token && res.data?.username) {
      api.setIdentityToken(res.data.token)

      authService.setToken("qrla_token", res.data.token)
      authService.setUsername(res.data.username)

      setAuthUsername(res.data.username)
      setAuthToken(res.data.token)
      setPassword("")
      setPasswordConfirm("")
      setAuthEmail("")

      setIsLoading(false)
      return
    }
    setIsSubmitted(false)
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
    <Screen preset="auto" contentContainerStyle={$ScreenStyle} safeAreaEdges={["top"]}>
      {isLoading && <LoadingOverlay />}
      <View style={$screenContentContainer}>
        <View style={$headerContainer}>
          <AutoImage source={qrlaLogo} style={{ width: imageSize, height: imageSize }} />

          <View style={{ width: "100%" }}>
            <Text
              testID="SignIn-heading"
              text="Free from nasty QR scammers."
              preset="heading"
              style={$signInHeading}
            />
          </View>
        </View>
        {authError && <Text text={authError} size="sm" weight="light" style={$hint} />}
        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="Email"
          helper={emailError}
          status={emailError ? "error" : undefined}
          onChange={() => setAuthError("")}
        />
        <TextField
          value={authUsername}
          onChangeText={setAuthUsername}
          containerStyle={$textField}
          autoCorrect={false}
          placeholder="Username"
          helper={usernameError}
          status={usernameError ? "error" : undefined}
          onSubmitEditing={() => authPasswordInput.current?.focus()}
          onChange={() => setAuthError("")}
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
          onChange={() => setAuthError("")}
        />
        <TextField
          ref={authPasswordConfirmInput}
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          placeholder="Confirm Password"
          RightAccessory={PasswordRightAccessory}
          onChange={() => setAuthError("")}
        />
        <Button
          text="Create Account"
          disabledStyle={{
            borderColor: colors.palette.neutral500,
          }}
          disabledTextStyle={{
            color: colors.palette.neutral500,
          }}
          //@ts-ignore
          onPress={Register}
        />
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.lg,
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
