import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, View, ViewStyle } from "react-native"
import {
  AutoImage,
  Button,
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing, typography } from "../theme"
import { useNavigation } from "@react-navigation/native"
import AppleLogin from "app/components/CustomComponents/AppleLogin/AppleLogin"
import GoogleLogin from "app/components/CustomComponents/GoogleLogin/GoogleLogin"
import { Platform } from "react-native"
import { assetService } from "app/services/Assets/AssetService"

import { $termsHyperlink } from "../theme"
import SeperatorWithText from "../components/SeperatorWithText"
import { Dimensions } from "react-native"

interface SignInProps extends AppStackScreenProps<"SignIn"> {}

export const SignInScreen: FC<SignInProps> = observer(function SignIn(_props) {
  const navigation = useNavigation()

  const qrlaLogo = assetService.qrlaLogo
  const { height } = Dimensions.get("window")
  const imageSize = height < 700 ? 56 : 112
  console.log(height)
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$headerContainer}>
        <AutoImage source={qrlaLogo} style={{ width: imageSize, height: imageSize }} />

        <View style={{ width: "100%" }}>
          <Text
            testID="SignIn-heading"
            tx="SignInScreen.signIn"
            preset="heading"
            style={$signInHeading}
          />
        </View>
      </View>
      <View style={$buttonsContainer}>
        <View style={$buttonsElementStyle}>{Platform.OS === "ios" && <AppleLogin />}</View>
        <View>
          <GoogleLogin />
        </View>
        <SeperatorWithText text="or" />
        <View style={$buttonsElementStyle}>
          <Button
            testID="signUp-button"
            style={$tapButton}
            text="Sign Up"
            //@ts-ignore
            onPress={() => navigation.navigate("SignUp")}
          />
        </View>
        <View style={$buttonsElementStyle}>
          <Text>
            <Text style={$termsTextStyle} tx="SignInScreen.termsAndConditions_1" />
            <Text
              style={{ ...$termsTextStyle, ...$termsHyperlink }}
              tx="SignInScreen.termsAndConditions_2"
            />
            <Text style={$termsTextStyle} tx="SignInScreen.termsAndConditions_3" />
            <Text
              style={{ ...$termsTextStyle, ...$termsHyperlink }}
              tx="SignInScreen.privacyPolicy"
            />
          </Text>
          <Text />
          <Text>
            <Text style={$termsTextStyle} text="Already have an account? " />
            <Text style={{ ...$termsTextStyle, ...$termsHyperlink }} text="Sign in" />
          </Text>
        </View>
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.lg,
  // backgroundColor: "blue",
  flex: 1,
  alignItems: "center",
  justifyContent: "space-between",
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
  marginTop: spacing.xl2,
  fontSize: typography.fontSizes.h2,
  color: colors.palette.neutral100,
}

const $tapButton: ViewStyle = {
  borderRadius: 50,
}

const $buttonsContainer: ViewStyle = {
  // backgroundColor: "red",
  width: "100%",
  marginTop: spacing.xl2 + 8,
}

const $buttonsElementStyle: ViewStyle = {
  marginBottom: spacing.md,
}

const $termsTextStyle: TextStyle = {
  fontSize: 12,
}
