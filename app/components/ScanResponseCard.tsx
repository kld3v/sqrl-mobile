import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet, Pressable, Image } from "react-native"
import { observer } from "mobx-react-lite"
import { colors } from "app/theme"
import { Text } from "app/components/Text"
import { useState } from "react"
import SafeScannedPing from "./Audio/SafeScannedPing"
import { Feather } from "@expo/vector-icons"
import { openLinkInBrowser } from "app/utils/openLinkInBrowser"
import OnScanHaptic from "./Haptics/OnScanHaptic"

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
  const iconSize = 72
  const { trustScore, safe, destination, scanState } = props

  const [leaving, setLeaving] = useState(false)

  const setDelayedLeaving = (): void => {
    setLeaving(true)
    setTimeout(() => openLinkInBrowser(destination!), 2000)
  }

  const scannedState = (
    <>
      <View style={styles.textAndButton}>
        <Text style={styles.infoText}>{trustScore && `trust score: ${trustScore}`} </Text>
        <Pressable onPress={() => setDelayedLeaving()}>
          <Text style={styles.infoText}>
            {safe ? "Go to" : "Still proceed to"} {destination}
          </Text>
        </Pressable>

        <SafeScannedPing />
        <OnScanHaptic scanState={scanState} safe={safe} />
      </View>
      {safe ? (
        <>
          <Feather name="check-circle" size={iconSize} color={"#a2f732"} />
        </>
      ) : (
        <Feather name="alert-circle" size={iconSize} color={"#eb4034"} />
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
        <Text style={styles.infoText}>Byeeeeeeeee</Text>
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
    padding: 24,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    flexDirection: "row",
  },
  infoText: {
    color: colors.palette.neutral200,
    fontWeight: "bold",
    fontSize: 16,
  },
  textAndButton: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  checkCircle: {
    flex: 1,
  },
})
