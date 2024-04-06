import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Button, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { useNavigation } from "@react-navigation/native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen() {
  const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="signUp" />
      <Button title="Login" onPress={() => navigation.navigate("SignIn")} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
