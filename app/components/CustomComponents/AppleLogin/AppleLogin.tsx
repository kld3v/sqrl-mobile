import { authService } from "app/services/Auth"
import { api } from "app/services/api"
import { spacing } from "app/theme"
import * as AppleAuthentication from "expo-apple-authentication"
import { View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"

export const AppleLogin = observer(function AppleLogin(props: { setLoading: any }) {
  const { setLoading } = props
  const navigation = useNavigation()

  return (
    <View style={$appleButtonContainer}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        style={{
          width: "100%",
          height: 40,
        }}
        cornerRadius={50}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            })
            setLoading(true)
            console.log(credential.identityToken)
            //api call with identity token
            // const appleTokenRes = await api.apisauce.post("/auth/apple/login", {
            //   identity_token: credential.identityToken,
            // })

            // if (!appleTokenRes.ok) {
            //   alert("Failed to log in - Please Try Again")
            //   return
            // }
            // // Don't set to state till we've figured out what's going on with username
            // authService.setToken("apple_token", appleTokenRes.data.identity_token)

            // if (!appleTokenRes.data.username) {
            //   // check secureStore for username right?
            //   // Come back handle expiration at some point
            //   //@ts-ignore
            // }

            navigation.navigate("Username")
            // signed in
            setLoading(false)
          } catch (e: any) {
            if (e.code === "ERR_REQUEST_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    </View>
  )
})

export default AppleLogin

const $appleButtonContainer: ViewStyle = {
  flex: 1,
  alignItems: "stretch",
  justifyContent: "center",
  marginBottom: spacing.md,
}
