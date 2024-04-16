import { authService } from "app/services/Auth"
import { api } from "app/services/api"
import { spacing } from "app/theme"
import * as AppleAuthentication from "expo-apple-authentication"
import { View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { AuthAPIResponse } from "app/screens/AuthFlow/Auth.types"
import { useStores } from "app/models"

export const AppleLogin = observer(function AppleLogin(props: { setLoading: any }) {
  const { setLoading } = props
  const navigation = useNavigation()
  const {
    authenticationStore: { setAuthToken, setAuthUsername },
  } = useStores()

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
            //api call with identity token
            const res: AuthAPIResponse = await api.auth.post("/apple/signin", {
              identity_token: credential.identityToken,
            })

            if (!res.ok) {
              alert("Failed to log in - Please Try Again")
            }
            // Don't set to state till we've figured out what's going on with username

            if (res.ok && !res.data?.token) {
              alert("Failed to get token from Apple, please try again. ")
            }

            if (res.ok && res.data?.token) {
              try {
                const { token } = res.data
                await authService.setToken("apple_token", token)
                api.setIdentityToken(token)
                if (!res.data?.username) {
                  //@ts-ignore
                  navigation.navigate("Username")
                } else {
                  setAuthUsername(res.data.username)
                  setAuthToken(token)
                }
              } catch (error) {
                alert("ooops - something went wrong")
              }
            }
            setLoading(false)
          } catch (e: any) {
            if (e.code === "ERR_REQUEST_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }

            setLoading(false)
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
