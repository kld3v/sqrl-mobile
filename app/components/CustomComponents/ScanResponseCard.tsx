import * as React from "react"
import {
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  Image,
  ImageStyle,
  Dimensions,
  TextStyle,
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
import { qrScannerService } from "app/services/QrScanner"

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
  const {
    trustScore,
    safe,
    setSafe,
    scanState,
    setScanState,
    url,
    setUrl,
    errorMessage,
    setErrorMessage,
  } = props

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
      <View style={styles.textAndButton}>
        <Text style={styles.infoText}>
          <Text preset="bold" style={{ color: colors.palette.neutral200 }}>
            {qrScannerService.getPrimaryDomainName(url!)}
          </Text>{" "}
          - {trustScore && `trust score: ${trustScore}`}
        </Text>
        {safe ? (
          <Button
            tx="scannerScreen.proceedButton"
            onPress={setDelayedLeaving()}
            style={{
              backgroundColor: colors.palette.primary600,
              width: "90%",
            }}
            pressedStyle={[{ backgroundColor: colors.palette.primary300 }, { borderRadius: 0 }]}
            pressedTextStyle={{ color: colors.palette.neutral200 }}
            textStyle={{
              color: colors.palette.neutral200,
              textAlign: "center",
            }}
          />
        ) : (
          <View style={$unsafeScanButtons}>
            <Button text="Cancel" tx="common.cancel" preset="filled" onPress={resetScanState()} />
            <Button
              text="Accept Risk"
              onPress={setDelayedLeaving()}
              style={{ backgroundColor: colors.palette.angry500 }}
            />
          </View>
        )}

        <SafeScannedPing />
        <OnScanHaptic scanState={scanState} safe={safe} />
      </View>
      {safe ? (
        <>
          <Feather name="check-circle" size={iconSize} color={colors.palette.primary600} />
        </>
      ) : (
        <Feather name="alert-circle" size={iconSize} color={colors.palette.angry500} />
      )}
    </>
  )
  const scanningState = (
    <>
      <OnScanHaptic scanState={scanState} />

      <Text style={styles.infoText}>Checking your QR code...</Text>
    </>
  )

  const leavingState = (
    <>
      <View style={styles.textAndButton}>
        <Text style={styles.infoText}>See ya! </Text>
      </View>
      {/* <AutoImage
        source={koalaGif}
        style={{ width: iconSize, height: iconSize }}
        resizeMethod="auto"
      /> */}
    </>
  )

  const errorState = (
    <>
      <OnScanHaptic scanState={scanState} safe={false} />
      <View style={$errorMessageStyle}>
        <Text style={styles.infoText}>{errorMessage}</Text>
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
      case leaving:
        return leavingState
      default:
        return null
    }
  }

  return (
    <>
      {scanState === "scanned" && (
        <View style={$messageBoxContainer}>
          <View
            style={{
              ...$messageBoxText,
              borderColor: !safe ? colors.palette.angry500 : colors.palette.primary500,
            }}
          >
            {safe ? <Tick style={$messageBoxIcon} /> : <Cancel style={$messageBoxIcon} />}
            <Text weight="boldItalic" size="xxl" style={safe ? $safeText : $unsafeText}>
              {safe ? "Good To Go!" : "Caution!"}
            </Text>
            <Text weight="mediumItalic" size="xs" style={$unsafeText}>
              {!safe && "This QR code may be risky. Proceed at your own risk."}
            </Text>
          </View>
        </View>
      )}
      <View style={$CTAinfoBoxContainer}>
        <View style={styles.infoBox}>{renderCTAState()}</View>
      </View>
    </>
  )
})

const $safeText = {
  color: colors.palette.primary600,
}
const $unsafeText = {
  color: colors.palette.angry100,
}
const screenHeight = Dimensions.get("window").height

const messageBoxPosition = screenHeight * 0.09

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

const $messageBoxText: TextStyle = {
  minWidth: 200,
  maxWidth: "100%",
  paddingHorizontal: 32,
  paddingVertical: spacing.md,
  backgroundColor: colors.scannerInfoBox,
  borderRadius: 28,
  borderWidth: 1,
  shadowColor: "#000",
  shadowOffset: { width: 2, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: colors.palette.angry500,
}
const $CTAinfoBoxContainer: ViewStyle = {
  zIndex: 99,
  position: "absolute",
  bottom: spacing.xxxl,
  height: 100,
  width: "100%",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}

const styles = StyleSheet.create({
  infoBox: {
    height: 100,
    minWidth: 200,
    maxWidth: "80%",
    paddingHorizontal: 32,
    backgroundColor: colors.scannerInfoBox,
    borderRadius: 28,
    borderColor: "white",
    borderWidth: 1,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: colors.palette.angry500,
  },
  infoText: {
    fontFamily: typography.Poppins.boldItalic,
  },
  textAndButton: {},
})

const $unsafeScanButtons: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
}

const $errorMessageStyle: ViewStyle = {
  flex: 2,
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexDirection: "column",
}
