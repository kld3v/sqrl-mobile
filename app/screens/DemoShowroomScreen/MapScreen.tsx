import React, { FC, useState } from "react"
import { ViewStyle } from "react-native"

import { Screen, Text } from "../../components"

import { DemoTabScreenProps } from "../../navigators/DemoNavigator"

export const MapScreen: FC<DemoTabScreenProps<"Map">> = function MapScreen(_props) {
  const [open, setOpen] = useState(false)

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
      <Text>Coming Soon</Text>
    </Screen>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
}
