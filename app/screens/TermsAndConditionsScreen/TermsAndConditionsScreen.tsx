import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { AutoImage, Screen, Text, Toggle, Button } from "app/components"
import { spacing, typography } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"
import * as WebBrowser from "expo-web-browser"
import { $hyperlink } from "app/theme/styles"

interface TermsAndConditionsScreenProps extends AppStackScreenProps<"TermsAndConditions"> {}

export const TermsAndConditionsScreen: FC<TermsAndConditionsScreenProps> = observer(
  function TermsAndConditionsScreen() {
    const [value, setValue] = useState(false)
    return (
      <Screen style={$root} preset="scroll">
        <View style={$TermsViewContainerStyle}>
          <AutoImage
            source={require("../../../assets/images/winkface.png")}
            style={{ width: 200, height: 200, alignSelf: "center" }}
          />
          <Text
            preset="heading"
            tx="termsScreen.title"
            style={{ alignSelf: "center", fontSize: typography.fontSizes.h3 }}
          />
          <Text style={$bodyStyle}>
            <Text text="Wait a minute! Before you dive into scanning, please take a quick moment to review our " />
            <Text
              style={$hyperlink}
              text="Terms and Conditions"
              onPress={() => WebBrowser.openBrowserAsync("https://qrla.io")}
            />
            <Text text=" and " />
            <Text
              style={$hyperlink}
              text="Privacy Policy"
              onPress={() => WebBrowser.openBrowserAsync("https://qrla.io")}
            />
            <Text text=". For a smooth and secure experience with QRLA. Then, you'll be all ready to scan away." />
          </Text>

          <Toggle
            value={value}
            onValueChange={setValue}
            variant="checkbox"
            label="I have read and agree to the terms and conditions of the privacy policy."
            labelStyle={{
              fontFamily: typography.fonts.poppins.light,
              fontSize: typography.fontSizes.body3,
              lineHeight: typography.lineHeights.body3,
            }}
          />
          <Button text="Scan" style={{ flex: 1 }} />
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $TermsViewContainerStyle: ViewStyle = {
  flex: 1,

  width: "100%",
  backgroundColor: "blue",
}

const $bodyStyle: TextStyle = {
  textAlign: "center",
  marginVertical: spacing.xl,
}

const $toggleAndButton: ViewStyle = {
  flex: 1,
}
