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
import { Feather } from "@expo/vector-icons"

import OnScanHaptic from "../Haptics/OnScanHaptic"
import * as WebBrowser from "expo-web-browser"
import { Button } from "../Button"

import Cancel from "../Svg/Cancel"
import Tick from "../Svg/Tick"
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
  const iconSize = 220
  const { safe, setSafe, scanState, setScanState, url, setUrl, errorMessage, setErrorMessage } =
    props

  const [leaving, setLeaving] = useState(false)

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

  const scannedState = (
    <>
      {safe ? (
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
          textStyle={{
            color: colors.palette.neutral200,
            fontSize: 16,
            fontFamily: typography.primary.bold,
          }}
        />
      ) : (
        <Button
          text="Cancel"
          tx="common.cancel"
          style={{
            backgroundColor: colors.palette.angry500,
            borderRadius: 25, // Half of the height
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
          }}
          onPress={resetScanState()}
        />
      )}

      <SafeScannedPing />
      <OnScanHaptic scanState={scanState} safe={safe} />
    </>
  )
  const scanningState = (
    <>
      <OnScanHaptic scanState={scanState} />
      <Text>Checking your QR code...</Text>
    </>
  )

  const errorState = (
    <>
      <OnScanHaptic scanState={scanState} safe={false} />
      <View style={$errorMessageStyle}>
        <Text>{errorMessage}</Text>
        <Button text="Try Again" preset="filled" onPress={resetScanState()} style={{ margin: 2 }} />
      </View>
      <Feather name="alert-circle" size={iconSize} color={colors.palette.angry500} />
    </>
  )

  const renderCTAState = (): React.JSX.Element | null => {
    switch (true) {
      case !!errorMessage:
        return errorState
      case scanState === "scanning":
        return scanningState
      case scanState === "scanned" && !leaving:
        return scannedState
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
              {safe ? "Good To Go!" : "Caution!"}
            </Text>

            {!safe && (
              <Text
                weight="mediumItalic"
                size="xs"
                style={$unsafeText}
                text="This QR code may be risky. Proceed at your own risk."
              />
            )}
          </View>
        </View>
      )}
      <View style={$infoBoxPositioningContainer}>
        <View
          style={{
            ...$infoBoxCustom,
            borderColor: safe ? colors.palette.primary500 : colors.palette.angry500,
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
          {!safe && ProceedAnyway}
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
  borderRadius: 28,
  borderWidth: 2,
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
  color: colors.palette.angry500,
}

const $infoBoxTopWithMessage: TextStyle = {
  ...$infoBoxCustomBg,
  ...$infoBoxCustom,
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

const $errorMessageStyle: ViewStyle = {
  flex: 2,
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexDirection: "column",
}
