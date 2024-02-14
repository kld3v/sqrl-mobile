import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet, Image } from "react-native"
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
  destination: string | null
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
  const { trustScore, safe, destination, scanState, setScanState } = props

  const [leaving, setLeaving] = useState(false)

  const setDelayedLeaving = (): void => {
    setLeaving(true)
    setTimeout(async () => await WebBrowser.openBrowserAsync(destination!), 2000)
    setScanState("notScanned")
  }

  const cancelScan = (): (() => void) => {
    return () => {
      setScanState("notScanned")
    }
  }
  const scannedState = (
    <>
      <View style={styles.textAndButton}>
        <Text style={styles.infoText}>{trustScore && `Trust score: ${trustScore}`} </Text>

        {safe ? (
          <Button text="Go" onPress={() => setDelayedLeaving()} />
        ) : (
          <View style={$unsafeScanButtons}>
            <Button text="Cancel" tx="common.cancel" preset="filled" onPress={cancelScan()} />
            <Button
              text="Accept Risk"
              onPress={() => setDelayedLeaving()}
              style={{ backgroundColor: colors.palette.angry500 }}
            />
          </View>
        )}

        <SafeScannedPing />
        <OnScanHaptic scanState={scanState} safe={safe} />
      </View>
      {safe ? (
        <>
          <Feather name="check-circle" size={iconSize} color={colors.palette.primary500} />
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
    fontWeight: "bold",
  },
  textAndButton: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
})

const $unsafeScanButtons: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
}
