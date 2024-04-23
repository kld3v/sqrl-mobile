import React, { FC, useCallback, useState } from "react"
import { TextStyle, ViewStyle, View, Dimensions, Alert } from "react-native"
import { Button, Icon, ListItem, Screen, Text } from "../components"
import { colors, spacing, typography } from "../theme"

import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import QrlaButton from "app/components/CustomComponents/QrScanner/QrlaButton"

import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { authService } from "app/services/Auth"
import { api } from "app/services/api"
import { secureStoreInstance } from "app/services/SecureStore/SecureStorageService"

interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen() {
  const {
    authenticationStore: { authUsername, authEmail, setAuthToken, setAuthUsername },
    leaderboardStore,
  } = useStores()

  const [loading, setLoading] = useState(false)

  const logout = useCallback(async () => {
    await authService.logout()
    await secureStoreInstance.clearFromSecureStore("userScore")
    leaderboardStore.setProp("userScore", "0")
    setAuthToken("")
    setAuthUsername("")
  }, [])

  const deleteAccount = async () => {
    try {
      let deletedResponse = api.apisauce.delete("/user")
      console.log(deletedResponse)
      if ((await deletedResponse).ok) {
        alert(`User account and data successfully deleted. `)
        setLoading(false)
        logout()
      } else {
        alert("Failed to delete, please try again or contact info@qrla.io for further assistance.")
      }
    } catch (error) {
      console.log(error)
      alert("Failed to delete, please try again. ")
    }
  }

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <QrlaButton />
      <View style={$userContent}>
        <Text preset="heading" text="Profile" style={$title} />
        <ListItem style={{ marginTop: spacing.md }}>
          <View>
            <Text text="Username:" />
            <Text preset="bold" text={authUsername} />
          </View>
        </ListItem>
        <ListItem style={{ marginTop: spacing.md }}>
          <View>
            <Text text="Email:" />
            <Text preset="bold" text={authEmail ? authEmail : "No email address"} />
          </View>
        </ListItem>
        <ListItem style={{ marginTop: spacing.md }}>
          <View>
            <Text text="Leaf Count:" />
            <Text preset="bold" text={leaderboardStore.getScore} />
          </View>
        </ListItem>
      </View>

      <View style={$buttonContainer}>
        <Text
          preset="formLabel"
          text="Caution - this is irreversible!"
          style={{ textAlign: "center", marginBottom: spacing.md }}
        />
        <Button
          text={loading ? "Deleting..." : "Delete Account"}
          style={{
            backgroundColor: colors.palette.angry500,
            borderRadius: 25, // Half of the height
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
          }}
          onPress={() => {
            setLoading(true)

            Alert.alert(
              "Confirm Action", // Title of the dialog
              "Are you sure you want to do this? It'll be sad to see ya go!", // Message of the dialog
              [
                // Array of buttons
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "OK", onPress: deleteAccount },
              ],
              { cancelable: false }, // The dialog is not cancelable outside of the buttons
            )
            setLoading(false)
          }}
          raisedButtonEdgeStyle={{ backgroundColor: colors.palette.angry500Pressed }}
          textStyle={{ fontFamily: typography.primary.bold }}
        />
      </View>
    </Screen>
  )
})

const baseTextStyle: TextStyle = {
  textAlign: "center",
}

const $container: ViewStyle = {
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.md,
  height: "100%",
}

const $userContent: ViewStyle = {
  justifyContent: "center",
  alignItems: "flex-start",
}

const $title: TextStyle = {
  marginTop: spacing.xxl,
  marginBottom: spacing.sm,
  fontFamily: "Borsok",
  color: colors.palette.primary500,

  ...baseTextStyle,
}
const { height } = Dimensions.get("window")
const $buttonContainer: ViewStyle = {
  height: "100%",

  flex: 1, // Takes up all space available in the container
  justifyContent: "flex-end", // Aligns children at the end of the container (bottom)
  marginBottom: 10, // Adds some margin at the bottom if needed
  // backgroundColor: "blue",
}
