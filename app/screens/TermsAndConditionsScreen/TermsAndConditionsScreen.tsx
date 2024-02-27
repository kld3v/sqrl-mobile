import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { AutoImage, Screen, Text, Toggle, Button } from "app/components"
import { colors, typography } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"
import * as WebBrowser from "expo-web-browser"
import { $hyperlink, $rootScreen, $title } from "app/theme/styles"
import {
  $contentContainer,
  $imageStyle,
  $bodyStyle,
  $toggleAndButtonContainer,
  $toggleContainerStyle,
} from "./TermsAndConditionsStyles"
import { useStores } from "app/models"

interface TermsAndConditionsScreenProps extends AppStackScreenProps<"TermsAndConditions"> {}

export const TermsAndConditionsScreen: FC<TermsAndConditionsScreenProps> = observer(
  function TermsAndConditionsScreen() {
    const [value, setValue] = useState(false)
    const [loading, setLoading] = useState(false)
    const { termsAndConditionsStore } = useStores()

    return (
      <Screen style={$rootScreen} preset="scroll">
        <View style={$contentContainer}>
          <View>
            <AutoImage
              source={require("../../../assets/images/winkface.png")}
              style={$imageStyle}
              resizeMode="contain"
            />
          </View>
          <Text
            preset="heading"
            tx="termsScreen.title"
            style={{ ...$title, fontFamily: typography.Poppins.boldItalic }}
          />
          <Text style={{ ...$bodyStyle }}>
            <Text
              weight="mediumItalic"
              text="Wait a minute! Before you dive into scanning, please take a quick moment to review our "
            />

            <Text
              style={$hyperlink}
              text={"Terms and Conditions"}
              onPress={() => WebBrowser.openBrowserAsync("https://qrla.io")}
            />
            <Text weight="mediumItalic" text=" and " />
            <Text
              text="Privacy Policy"
              style={$hyperlink}
              onPress={() => WebBrowser.openBrowserAsync("https://qrla.io")}
            />
            <Text
              weight="mediumItalic"
              text=". For a smooth and secure experience with QRLA. Then, you'll be all ready to scan away."
            />
          </Text>
          <View style={$toggleAndButtonContainer}>
            <Toggle
              value={value}
              onValueChange={setValue}
              variant="checkbox"
              label="I have read and agree to the terms and conditions of the privacy policy."
              labelStyle={{
                fontFamily: typography.fonts.poppins.light,
                fontSize: typography.fontSizes.body3,
                lineHeight: typography.lineHeights.body3,
                textAlign: "center",
              }}
              containerStyle={$toggleContainerStyle}
              koalify
            />
            <Button
              onPress={async () => {
                setLoading(true)
                await termsAndConditionsStore.signUserAgreements()
                setLoading(false)
              }}
              text={loading ? "Loading..." : "Continue"}
              style={{ flex: 1 }}
              disabled={!value}
              disabledStyle={{
                backgroundColor: colors.palette.neutral200,
                borderColor: colors.palette.neutral300,
              }}
              disabledTextStyle={{ color: colors.palette.neutral500 }}
            />
          </View>
        </View>
      </Screen>
    )
  },
)
