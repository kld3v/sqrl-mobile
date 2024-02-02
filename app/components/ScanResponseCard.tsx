import * as React from "react"
import {
  Linking,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  Pressable,
  Image,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Icon } from "./Icon"
import { useState } from "react"
import SafeScannedPing from "./Audio/SafeScannedPing"
import SafeScannedHaptic from "./Haptics/SafeScannedHaptic"
import { Feather } from "@expo/vector-icons"

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
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const ScanResponseCard = observer(function ScanResponseCard(props: ScanResponseCardProps) {
  const iconSize = 64
  const {
    style,
    trustScore,
    safe,
    destination,
    errorMessage,
    scanState,
    setScanState,
    setErrorMessage,
  } = props
  const $styles = [$container, style]
  const [leaving, setLeaving] = useState(false)

  const setDelayedLeaving = (): void => {
    setLeaving(true)
    setTimeout(() => Linking.openURL("https://qrla.io"), 2000)
  }
  const scanAgain =
    (errorMessage: string | null): (() => void) =>
    (): void => {
      setScanState("notScanned")
      errorMessage && setErrorMessage(null)
    }

  const scannedState = (
    <>
      <View style={styles.textAndButton}>
        <Text style={styles.infoText}>{trustScore && `trust score: ${trustScore}`} </Text>
        <Pressable onPress={() => setDelayedLeaving()}>
          <Text>
            {safe ? "Go to" : "Still proceed to"} {destination}
          </Text>
        </Pressable>
        <Pressable onPress={scanAgain(errorMessage)}>
          <Text>Scan Again</Text>
        </Pressable>
        <SafeScannedPing />
        <SafeScannedHaptic />
      </View>
      {safe ? (
        <Feather name="check-circle" size={iconSize} color={"#a2f732"} />
      ) : (
        <Feather name="alert-circle" size={iconSize} color={"#eb4034"} />
      )}
    </>
  )
  const scanningState = (
    <>
      <View style={styles.textAndButton}>
        <Text style={styles.infoText}>Scanning...</Text>
        <Pressable onPress={scanAgain(errorMessage)}>
          <Text>Cancel</Text>
        </Pressable>
      </View>
      <Image source={require("./loading.gif")} style={{ width: iconSize, height: iconSize }} />
    </>
  )

  if (leaving)
    return (
      <View style={styles.infoBox}>
        <View style={styles.textAndButton}>
          <Text style={styles.infoText}>Leaving...</Text>
        </View>
      </View>
    )

  return (
    <View style={$styles}>
      {scanState === "scanning" && scanningState}
      {scanState === "scanned" && scannedState}
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const styles = StyleSheet.create({
  infoBox: {
    position: "absolute",
    left: "10%",
    right: "10%",
    bottom: 116,
    width: "80%", // adjust this value as needed
    height: 96,
    padding: 16,
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
    color: "black",
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
