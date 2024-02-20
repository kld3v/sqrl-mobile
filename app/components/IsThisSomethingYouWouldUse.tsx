import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Toggle } from "./Toggle"
import { useState } from "react"
import { TextField } from "./TextField"

export interface IsThisSomethingYouWouldUseProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const IsThisSomethingYouWouldUse = observer(function IsThisSomethingYouWouldUse(
  props: IsThisSomethingYouWouldUseProps,
) {
  const { style } = props
  const $styles = [$container, style]

  const [yesReponse, setYesReponse] = useState(false)
  const [noResponse, setNoResponse] = useState(false)
  const [why, setWhy] = useState("")

  return (
    <View style={$styles}>
      <Text style={$text}>Is this something you would use? </Text>
      <Toggle
        variant="switch"
        value={yesReponse}
        onValueChange={setYesReponse}
        inputOuterStyle={{ backgroundColor: colors.palette.primary500 }}
        inputInnerStyle={{ backgroundColor: colors.palette.neutral400 }}
        helper="I would use this feature"
        status={noResponse ? "disabled" : undefined}
        disabled={noResponse}
      />
      <Toggle
        variant="switch"
        value={noResponse}
        onValueChange={setNoResponse}
        inputOuterStyle={{ backgroundColor: colors.palette.angry500 }}
        inputInnerStyle={{ backgroundColor: colors.palette.neutral400 }}
        helper="nah"
        status={yesReponse ? "disabled" : undefined}
        disabled={yesReponse}
      />
      <TextField
        value={why}
        onChangeText={setWhy}
        label="Any other thoughts?"
        placeholder="I would use this feature because..."
        status={noResponse || yesReponse ? "disabled" : undefined}
      />
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  paddingTop: spacing.sm,
  marginBottom: spacing.sm,
  fontFamily: typography.Poppins.bold,
  lineHeight: spacing.xl2,
  fontSize: 28,
  color: colors.palette.neutral100,
}
