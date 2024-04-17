import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { AutoImage, Button, Screen, Text } from "../../../components"
import { AppStackScreenProps } from "../../../navigators"
import { $hint, colors, spacing, typography } from "../../../theme"
import { useNavigation } from "@react-navigation/native"
import AppleLogin from "app/components/CustomComponents/AppleLogin/AppleLogin"
import GoogleLogin from "app/components/CustomComponents/GoogleLogin/GoogleLogin"
import { Platform } from "react-native"
import { assetService } from "app/services/Assets/AssetService"

import { $termsHyperlink, $ScreenStyle } from "../../../theme"
import SeperatorWithText from "../../../components/SeperatorWithText"
import { Dimensions } from "react-native"
import LoadingOverlay from "app/components/LoadingOverlay"
import { useStores } from "app/models"
import * as WebBrowser from "expo-web-browser"

interface SignUpProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpProps> = observer(function SignUp(_props) {
  const navigation = useNavigation()
  const {
    authenticationStore: { authError, setAuthToken },
  } = useStores()
  const [loading, setLoading] = useState(false)
  const qrlaLogo = assetService.qrlaLogo
  const { height } = Dimensions.get("window")
  const imageSize = height < 700 ? 56 : 112

  return (
    <Screen preset="auto" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$ScreenStyle}>
      {loading && <LoadingOverlay />}
      <View style={$screenContentContainer}>
        <View style={$headerContainer}>
          <AutoImage source={qrlaLogo} style={{ width: imageSize, height: imageSize }} />

          <View style={{ width: "100%" }}>
            <Text
              testID="SignUp-heading"
              tx="SignUpScreen.signIn"
              preset="heading"
              style={$signInHeading}
            />
          </View>
        </View>
        {authError && <Text text={authError} size="sm" weight="light" style={$hint} />}
        <View style={$buttonsContainer}>
          <View style={$buttonsElementStyle}>
            {Platform.OS === "ios" && <AppleLogin setLoading={setLoading} />}
          </View>
          <View>
            <GoogleLogin setLoading={setLoading} />
          </View>
          <SeperatorWithText text="or" />
          <View style={$buttonsElementStyle}>
            <Button
              testID="signUp-button"
              style={$tapButton}
              text="Sign Up"
              //@ts-ignore
              onPress={() => navigation.navigate("Registration")}
            />
          </View>
          <View style={$buttonsElementStyle}>
            <Text>
              <Text style={$termsTextStyle} tx="SignUpScreen.termsAndConditions_1" />
              <Text
                style={{ ...$termsTextStyle, ...$termsHyperlink }}
                tx="SignUpScreen.termsAndConditions_2"
                onPress={() =>
                  WebBrowser.openBrowserAsync(
                    "https://app.termly.io/document/terms-of-service/e64123bf-73e9-4931-9513-4b5c5239e742",
                  )
                }
              />
              <Text style={$termsTextStyle} tx="SignUpScreen.termsAndConditions_3" />
              <Text
                style={{ ...$termsTextStyle, ...$termsHyperlink }}
                tx="SignUpScreen.privacyPolicy"
                onPress={() =>
                  WebBrowser.openBrowserAsync(
                    "https://app.termly.io/document/privacy-policy/512bce2e-3988-4d22-a896-1382e94ddbe3",
                  )
                }
              />
            </Text>
            <Text />
            <Text>
              <Text style={$termsTextStyle} text="Already have an account? " />
              <Text
                style={{ ...$termsTextStyle, ...$termsHyperlink }}
                text="Log in"
                //@ts-ignore
                onPress={() => navigation.navigate("LogIn")}
              />
              <Text style={$termsTextStyle} text=" or " />
              <Text
                style={{ ...$termsTextStyle, ...$termsHyperlink }}
                text="just scan."
                //@ts-ignore
                onPress={() => {
                  setAuthToken("scannerOnly")
                }}
              />
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  // backgroundColor: "blue",
  height: "100%",
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
