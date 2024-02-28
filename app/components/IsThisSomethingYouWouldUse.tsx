import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Toggle } from "./Toggle"
import { useCallback, useState } from "react"
import { TextField } from "./TextField"
import { Icon } from "./Icon"
import { Button } from "./Button"
import { userFeedbackService } from "app/services/UserFeedback/UserFeedbackService"

export interface IsThisSomethingYouWouldUseProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  questionID: number
}

/**
 * Describe your component here
 */
export const IsThisSomethingYouWouldUse = observer(function IsThisSomethingYouWouldUse(
  props: IsThisSomethingYouWouldUseProps,
) {
  const { style, questionID } = props
  const $styles = [$container, style]

  const [yesReponse, setYesReponse] = useState(false)
  const [noResponse, setNoResponse] = useState(false)
  const [why, setWhy] = useState("")
  const [sent, setSent] = useState(false)

  const sendFeedback = useCallback(
    async (
      questionID: number,
      yesReponse: boolean,
      noResponse: boolean,
      why: string,
    ): Promise<void> => {
      let toggleResponse
      if (!yesReponse && !noResponse) {
        toggleResponse = "no response"
      } else {
        toggleResponse = yesReponse ? "yes" : "no"
      }

      try {
        await userFeedbackService.sendFeedback(questionID, toggleResponse, why)
      } catch (error) {
        console.log(
          `\n error at sendFeedback in IsThisSomethingYouWouldUse component. \n Failed to send feedback. \n Soz. \n ${error}`,
        )
      }
      setSent(true)
    },
    [],
  )

  return (
    <View style={$styles}>
      {sent ? (
        <Text style={$text}>Thank you for your feedback!</Text>
      ) : (
        <>
          <Text style={$text}>Is this something you would use? </Text>
          <Toggle
            variant="switch"
            value={yesReponse}
            onValueChange={() => {
              setYesReponse(true)
              setNoResponse(false)
            }}
            inputOuterStyle={{ backgroundColor: colors.palette.neutral300 }}
            inputInnerStyle={{ backgroundColor: colors.palette.primary500 }}
            helper="Yes"
            HelperTextProps={{ style: { marginTop: -4 } }}
          />
          <Toggle
            variant="switch"
            value={noResponse}
            onValueChange={() => {
              setNoResponse(true)
              setYesReponse(false)
            }}
            containerStyle={{ marginBottom: spacing.sm }}
            inputOuterStyle={{ backgroundColor: colors.palette.neutral300 }}
            inputInnerStyle={{ backgroundColor: colors.palette.angry500 }}
            helper="No"
            HelperTextProps={{ style: { marginTop: -4 } }}
          />
          <TextField
            value={why}
            onChangeText={(text) => setWhy(text)}
            accessibilityLabel="Any other thoughts?"
            placeholder="Any other thoughts?"
            numberOfLines={8}
            multiline
          />
          <Button
            onPress={() => sendFeedback(questionID, yesReponse, noResponse, why)}
            text="Send"
            textStyle={{ paddingRight: spacing.xxs }}
            RightAccessory={() => (
              <Icon icon="paperPlane" size={16} color={colors.palette.accent100} />
            )}
            style={{
              borderRadius: 40,
              marginTop: spacing.sm,
              marginVertical: spacing.md,
            }}
          />
        </>
      )}
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
  flexWrap: "wrap",
  fontSize: 28,
  color: colors.palette.neutral100,
}
