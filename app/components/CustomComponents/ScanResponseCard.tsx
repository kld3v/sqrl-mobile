import * as React from "react"
import {
  StyleProp,
  View,
  ViewStyle,
  ImageStyle,
  Dimensions,
  TextStyle,
  TouchableOpacity,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { useState } from "react"
import SafeScannedPing from "../Audio/SafeScannedPing"

import OnScanHaptic from "../Haptics/OnScanHaptic"
import * as WebBrowser from "expo-web-browser"
import { Button } from "../Button"

import Cancel from "../Svg/Cancel"
import Tick from "../Svg/Tick"
import { AutoImage } from "../AutoImage"

export type ScanStateOptions = "scanned" | "notScanned" | "scanning"

export interface ScanResponseCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  trustScore: number | null
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  safe: boolean
  setSafe: React.Dispatch<React.SetStateAction<boolean>>
  scanState: ScanStateOptions
  setScanState: React.Dispatch<React.SetStateAction<ScanStateOptions>>
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
  errorMessage: string | null

  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const ScanResponseCard = observer(function ScanResponseCard(props: ScanResponseCardProps) {
  const { safe, setSafe, scanState, setScanState, url, setUrl, errorMessage, setErrorMessage } =
    props

  const [leaving, setLeaving] = useState(true)
  const [pressed, setpressed] = useState(false)
  const setDelayedLeaving = (): (() => void) => () => {
    setLeaving(true)
    setTimeout(async () => {
      try {
        await WebBrowser.openBrowserAsync(url!)
        resetScanState()()
      } catch (error) {
        console.error(error)
        setErrorMessage("Not a valid URL. Soz. Try again.")
      }
    }, 2000)
  }

  const resetScanState = (): (() => void) => {
    return () => {
      setScanState("notScanned")
      setSafe(false)
      setUrl("")
      setErrorMessage(null)
    }
  }

  const scanCompleteContent = (
    <>
      {safe ? (
        <>
          <Button
            tx="scannerScreen.proceedButton"
            onPress={setDelayedLeaving()}
            style={{
              backgroundColor: colors.palette.primary600,
              borderRadius: 25, // Half of the height
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 30,
            }}
            onPressIn={() => setpressed(true)}
            onPressOut={() => setpressed(false)}
            pressedStyle={{
              backgroundColor: colors.palette.neutral200,
              borderColor: colors.palette.neutral500,
            }}
            pressedTextStyle={{
              color: colors.palette.neutral100,
            }}
            textStyle={{
              color: colors.palette.neutral200,
              fontSize: 22,
              fontFamily: typography.primary.bold,
              paddingTop: 8,
            }}
          />
          <SafeScannedPing />
          <OnScanHaptic scanState={scanState} safe={safe} />
        </>
      ) : (
        <Button
          text="Cancel"
          tx="common.cancel"
          style={{
            backgroundColor: colors.palette.angry500,
            borderRadius: 25, // Half of the height
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 16,
            paddingHorizontal: 30,
          }}
          // onPress={resetScanState()}
          onPressIn={() => setpressed(true)}
          onPressOut={() => setpressed(false)}
          pressedStyle={{
            backgroundColor: colors.palette.neutral200,
            borderColor: colors.palette.neutral500,
          }}
          textStyle={{ fontFamily: typography.primary.bold }}
        />
      )}
    </>
  )

  const scanningContent = (
    <>
      <OnScanHaptic scanState={scanState} />
      <Text weight="mediumItalic">Checking your QR code...</Text>
    </>
  )
  const koalaGif = require("../../../assets/images/koala.gif")

  const leavingContent = (
    <>
      <View style={$infoBoxPositioningContainer}>
        <View
          style={{
            ...$infoBoxCustom,
            ...$infoBoxCustomBg,
            borderColor: colors.palette.neutral100,
          }}
        >
          <Text weight="boldItalic" text="See you soon!" />
          <AutoImage
            source={koalaGif}
            // to resize gif correctly. Do not mess with lest you feel my wrath.
            style={$koalaGif}
          />
        </View>
      </View>
    </>
  )

  const errorContent = (
    <>
      <OnScanHaptic scanState={scanState} safe={false} />
      <Button
        text="Try Again"
        style={{
          backgroundColor: colors.palette.neutral300,
          borderRadius: 25, // Half of the height
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
        onPress={resetScanState()}
        onPressIn={() => setpressed(true)}
        onPressOut={() => setpressed(false)}
        pressedStyle={{
          backgroundColor: colors.palette.neutral200,
          borderColor: colors.palette.neutral500,
        }}
        textStyle={{ fontFamily: typography.primary.bold }}
      />
    </>
  )

  const renderCTAState = (): React.JSX.Element | null => {
    switch (true) {
      case !!errorMessage:
        return errorContent
      case scanState === "scanning":
        return scanningContent
      case scanState === "scanned" && !leaving:
        return scanCompleteContent
      case leaving:
        return leavingContent
      default:
        return null
    }
  }
  const ProceedAnyway = (
    <TouchableOpacity onPress={setDelayedLeaving()}>
      <Text
        weight="mediumItalic"
        style={{
          color: colors.palette.angry100,
          textAlign: "center",
          textDecorationLine: "underline", // Add this line
        }}
        text="Proceed Anyway"
      />
    </TouchableOpacity>
  )
  if (leaving) return leavingContent

  return (
    <>
      {scanState === "scanned" && (
        <View style={$messageBoxContainer}>
          <View
            style={{
              ...$infoBoxTopWithMessage,
              borderColor: !safe ? colors.palette.angry500 : colors.palette.primary500,
            }}
          >
            {safe ? <Tick style={$messageBoxIcon} /> : <Cancel style={$messageBoxIcon} />}
            <Text weight="boldItalic" size="xxl" style={safe ? $safeText : $unsafeText}>
              {errorMessage ? "Oops!" : safe ? "Good To Go!" : "Caution!"}
            </Text>

            {!safe && (
              <Text weight="mediumItalic" size="xs" style={$unsafeText}>
                {errorMessage
                  ? errorMessage
                  : "This QR code looks risky.\nProceed at your own risk."}
              </Text>
            )}
          </View>
        </View>
      )}
      <View style={$infoBoxPositioningContainer}>
        <View
          style={{
            ...$infoBoxCustom,
            borderColor:
              scanState === "scanning"
                ? colors.palette.neutral100
                : safe
                ? colors.palette.primary500
                : colors.palette.angry500,
            shadowColor: pressed ? "transparent" : "#000",
            shadowOffset: pressed ? { width: 0, height: 0 } : { width: 0, height: 2 },
            elevation: pressed ? 0 : 5,
            backgroundColor:
              scanState === "scanning" || (scanState === "scanned" && leaving)
                ? colors.scannerInfoBox
                : "transparent",
            borderWidth: scanState === "scanning" || (scanState === "scanned" && leaving) ? 4 : 0,
          }}
        >
          {renderCTAState()}
        </View>
      </View>
      <View style={{ ...$infoBoxPositioningContainer, bottom: -8 }}>
        <View
          style={{
            ...$infoBoxCustom,
            borderColor: safe ? colors.palette.primary500 : colors.palette.angry500,
            paddingVertical: 4,
          }}
        >
          {!safe && !errorMessage && scanState === "scanned" && ProceedAnyway}
        </View>
      </View>
    </>
  )
})

const $safeText = {
  color: colors.palette.primary500,
}
const $unsafeText = {
  color: colors.palette.angry100,
}

const screenHeight = Dimensions.get("window").height
const messageBoxPosition = screenHeight * 0.05
const $messageBoxContainer: ViewStyle = {
  zIndex: 99,
  marginTop: messageBoxPosition,
  width: "100%",
  height: 200,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  transform: [{ scale: 0.8 }],
}

const $messageBoxIcon: ImageStyle = {
  position: "absolute",
  bottom: -62,
  right: -62,
  transform: [{ scale: 1.2 }],
}

const $standardShadow: any = {
  shadowColor: "#000",
  shadowOffset: { width: 2, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
}
const $infoBoxCustomBg: TextStyle = {
  backgroundColor: colors.scannerInfoBox,
  borderWidth: 4,
}
const $infoBoxCustom: TextStyle = {
  minWidth: 200,
  maxWidth: "100%",
  paddingHorizontal: 32,
  paddingVertical: spacing.md,
  ...$standardShadow,
  borderRadius: 28,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}

const $infoBoxTopWithMessage: TextStyle = {
  ...$infoBoxCustomBg,
  ...$infoBoxCustom,
  paddingHorizontal: spacing.xxxl,
  paddingVertical: spacing.lg,
}

const $infoBoxPositioningContainer: ViewStyle = {
  zIndex: 99,
  position: "absolute",
  bottom: spacing.xxxl,
  height: 100,
  width: "100%",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}

const $koalaGif: ImageStyle = {
  width: 60,
  height: 40,
  transform: [{ scale: 0.8 }],
}
