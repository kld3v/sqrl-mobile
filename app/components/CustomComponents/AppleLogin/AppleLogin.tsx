import { spacing } from "app/theme"
import * as AppleAuthentication from "expo-apple-authentication"
import { View, ViewStyle } from "react-native"

export default function AppleLogin() {
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
            console.log(credential)
            // signed in
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
}

const $appleButtonContainer: ViewStyle = {
  flex: 1,
  alignItems: "stretch",
  justifyContent: "center",
  marginBottom: spacing.md,
}
