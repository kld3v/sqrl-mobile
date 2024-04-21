import * as React from "react"
import { StyleProp, View, ViewStyle, TouchableOpacity, Platform } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { useCallback, useState } from "react"
import OnScanHaptic from "../../Haptics/OnScanHaptic"
import * as WebBrowser from "expo-web-browser"
import { Button } from "../../Button"

import Cancel from "../../Svg/Cancel"
import Tick from "../../Svg/Tick"
import { AutoImage } from "../../AutoImage"
import {
  $infoBoxPositioningContainer,
  $infoBoxCustom,
  $infoBoxCustomBg,
  $koalaGif,
  $messageBoxContainer,
  $infoBoxTopWithMessage,
  $messageBoxIcon,
  $safeText,
  $unsafeText,
} from "./ScanResponseDisplayStyles"
import SafeScanResultButton from "./SafeScanResultButton"
import DisplayUrlText from "../QrScanner/DisplayUrlText"
import UnSafeScanResultButton from "./UnSafeScanResultButton"

export type ScanStateOptions = "scanned" | "notScanned" | "scanning"

export interface ScanResponseDisplayProps {
  url: string
  safe: boolean
  scanState: ScanStateOptions
  setScanState: React.Dispatch<React.SetStateAction<ScanStateOptions>>
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
  errorMessage: string | null
  readyToScan: React.MutableRefObject<boolean>
  style?: StyleProp<ViewStyle>
}

export const ScanResponseDisplay = observer(function ScanResponseDisplay(
  props: ScanResponseDisplayProps,
) {
  const { safe, scanState, setScanState, url, errorMessage, setErrorMessage, readyToScan, style } =
    props

  const [leaving, setLeaving] = useState(false)
  const [pressed, setpressed] = useState(false)

  const setDelayedLeaving = () => {
    setLeaving(true)
    setTimeout(async () => {
      try {
        await WebBrowser.openBrowserAsync(url!)
        resetScanState()
      } catch (error) {
        console.error(error)
        setErrorMessage("Not a valid URL. Please try again.")
      }
    }, 2000)
  }

  const resetScanState = useCallback(() => {
    setScanState("notScanned")
    setErrorMessage(null)
    readyToScan.current = true
  }, [])

  const scanCompleteContent = (
    <>
      {safe ? (
        <SafeScanResultButton
          setDelayedLeaving={setDelayedLeaving}
          setPressed={setpressed}
          scanState={scanState}
          safe={safe}
        />
      ) : (
        <UnSafeScanResultButton resetScanState={resetScanState} />
      )}
    </>
  )

  const scanningContent = (
    <View style={{ marginBottom: spacing.md, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          backgroundColor: colors.scannerInfoBox,
          borderWidth: 4,
          borderColor: colors.palette.neutral100,
          height: 80,
          paddingHorizontal: spacing.xl2,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 28,
          marginBottom: spacing.md,
        }}
      >
        <OnScanHaptic scanState={scanState} />
        <Text>Inspecting your QR code...</Text>
      </View>
      <Button
        text="Try Again"
        style={{
          backgroundColor: colors.palette.neutral300,
          borderRadius: 25, // Half of the height
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
        onPress={() => resetScanState()}
        pressedStyle={{
          backgroundColor: colors.palette.neutral200,
          borderColor: colors.palette.neutral500,
        }}
        textStyle={{ fontFamily: typography.primary.bold }}
      />
    </View>
  )
  const koalaGif = require("../../../../assets/images/koala.gif")

  const leavingContent = (
    <>
      <View style={$infoBoxPositioningContainer}>
        <View
          style={{
            minWidth: 200,
            maxWidth: "100%",
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.sm,
            borderRadius: 32,
            justifyContent: "center",
            alignItems: "center",
            ...$infoBoxCustomBg,
            borderColor: colors.palette.neutral100,
            flexDirection: "row",
          }}
        >
          <Text
            weight="boldItalic"
            text="See you soon!"
            style={{ fontSize: typography.fontSizes.h5, marginTop: 4, marginRight: 8 }}
          />
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
        onPress={() => resetScanState()}
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
      default:
        return null
    }
  }
  const ProceedAnyway = (
    <TouchableOpacity onPress={setDelayedLeaving}>
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
    <View style={style}>
      {scanState === "scanned" && (
        <View style={$messageBoxContainer}>
          <View
            style={{
              ...$infoBoxTopWithMessage,
              borderColor: !safe ? colors.palette.angry500 : colors.palette.primary500,
            }}
          >
            {safe ? (
              <Tick style={$messageBoxIcon} />
            ) : (
              <TouchableOpacity onPress={() => resetScanState()} style={$messageBoxIcon}>
                <Cancel />
              </TouchableOpacity>
            )}
            <Text weight="boldItalic" size="xxl" style={safe ? $safeText : $unsafeText}>
              {errorMessage ? "Oops!" : safe ? "Good To Go!" : "Caution!"}
            </Text>

            {!safe && (
              <Text weight="mediumItalic" size="xs" style={$unsafeText}>
                {errorMessage
                  ? `${errorMessage} sdlfsf`
                  : "This QR code looks risky.\nProceed at your own risk."}
              </Text>
            )}
          </View>
        </View>
      )}
      <View style={$infoBoxPositioningContainer}>
        {scanState === "scanning" ? (
          scanningContent
        ) : (
          <>
            <DisplayUrlText url={url} scanState={scanState} />
            {renderCTAState()}
          </>
        )}

        <View style={{}}>
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
      </View>
    </View>
  )
})
