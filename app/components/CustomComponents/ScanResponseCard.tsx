import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet, Image, ImageStyle } from "react-native"
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
  const koalaGif = require("../../../assets/images/koala.gif")

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

      <AutoImage
        source={koalaGif}
        // to resize gif correctly. Do not mess with lest you feel my wrath.
        style={$koalaGif}
      />
    </>
  )

  const leavingState = (
    <>
      <View style={styles.textAndButton}>
        <Text style={styles.infoText}>See ya! </Text>
      </View>
      <AutoImage
        source={koalaGif}
        style={{ width: iconSize, height: iconSize }}
        resizeMethod="auto"
      />
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

  const renderState = (): React.JSX.Element | null => {
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

  return <View style={styles.infoBox}>{renderState()}</View>
})

const styles = StyleSheet.create({
  infoBox: {
    position: "absolute",
    left: "10%",
    right: "10%",
    bottom: 24,
    height: 100,
    padding: spacing.md,
    backgroundColor: colors.palette.neutral100,
    borderRadius: 28,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontFamily: typography.Poppins.bold,
    color: colors.palette.neutral200,
    fontSize: typography.ResponseCard.fontSize.medium,
    marginTop: spacing.md,
    // backgroundColor: colors.palette.neutral300,
    alignSelf: "center",
    width: "70%",
    marginLeft: 120,
  },
  textAndButton: {},
})

const $koalaGif: ImageStyle = {
  width: "100%",
  height: 220,
  transform: [{ scale: 0.3 }],
  marginLeft: -100,
}
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
