import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

export interface PushNotificationsScreenProps extends AppStackScreenProps<"PushNotifications"> {}

export const PushNotificationsScreen: FC<PushNotificationsScreenProps> = observer(
  function PushNotificationsScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top"]}>
        <Text text="pushNotifications" />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
