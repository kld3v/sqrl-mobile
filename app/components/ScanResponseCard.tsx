import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet, Image, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors } from "app/theme"
import { Text } from "app/components/Text"
import { useState } from "react"
import SafeScannedPing from "./Audio/SafeScannedPing"
import { Feather } from "@expo/vector-icons"

import OnScanHaptic from "./Haptics/OnScanHaptic"
import * as WebBrowser from "expo-web-browser"
import { Button } from "./Button"
export type ScanStateOptions = "scanned" | "notScanned" | "scanning"

export interface ScanResponseCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  trustScore: number | null
  url: string
  safe: boolean
  scanState: ScanStateOptions
  setScanState: React.Dispatch<React.SetStateAction<ScanStateOptions>>
  errorMessage: string | null

  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const ScanResponseCard = observer(function ScanResponseCard(props: ScanResponseCardProps) {
  const iconSize = 64
  const { trustScore, safe, scanState, setScanState, url } = props

  const [leaving, setLeaving] = useState(false)

  const setDelayedLeaving = (): (() => void) => () => {
    setLeaving(true)
    setTimeout(async () => {
      await WebBrowser.openBrowserAsync(url!)
      setScanState("notScanned")
    }, 2000)
  }

  const cancelScan = (): (() => void) => {
    return () => {
      setScanState("notScanned")
    }
  }

  function extractMainDomain(url: string): string | null {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
    if (match != null && match.length > 2 && typeof match[2] === "string" && match[2].length > 0) {
      const parts = match[2].split(".")
      return parts[parts.length - 2]
    }
    return null
  }
  const scannedState = (
    <>
      <View style={styles.textAndButton}>
        <Text style={styles.infoText}>
          <Text preset="bold" style={{ color: colors.palette.neutral200 }}>
            {extractMainDomain(url!)}
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
            <Button text="Cancel" tx="common.cancel" preset="filled" onPress={cancelScan()} />
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
      <View style={styles.textAndButton}>
        <Text style={styles.infoText}>Checking...</Text>
      </View>
      <Image
        source={require("./koala.gif")}
        style={{ width: iconSize, height: iconSize, zIndex: 100 }}
      />
    </>
  )

  const leavingState = (
    <>
      <View style={styles.textAndButton}>
        <Text style={styles.infoText}>See ya! </Text>
      </View>
      <Image
        source={require("./koala.gif")}
        style={{ width: iconSize, height: iconSize }}
        resizeMethod="auto"
      />
    </>
  )

  return (
    <View style={styles.infoBox}>
      {scanState === "scanning" && scanningState}
      {scanState === "scanned" && !leaving && scannedState}
      {leaving && leavingState}
    </View>
  )
})

const styles = StyleSheet.create({
  infoBox: {
    position: "absolute",
    left: "10%",
    right: "10%",
    bottom: 24,
    width: "80%",
    height: "auto",
    padding: 16,
    backgroundColor: colors.palette.neutral900,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: colors.palette.neutral200,
  },
  textAndButton: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
})

const $unsafeScanButtons: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
}
