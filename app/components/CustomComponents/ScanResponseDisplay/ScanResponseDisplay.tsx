import * as React from "react"
import { StyleProp, View, ViewStyle, TouchableOpacity, Platform } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
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

  const deviceIsAndroid = Platform.OS === "android"
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
        <Button
          text="Cancel"
          tx="common.cancel"
          style={{
            backgroundColor: colors.palette.angry500,
            borderRadius: 25, // Half of the height
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
          }}
          onPress={() => resetScanState()}
          onPressIn={() => setpressed(true)}
          onPressOut={() => setpressed(false)}
          raisedButtonEdgeStyle={{ backgroundColor: colors.palette.angry500Pressed }}
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
  const koalaGif = require("../../../../assets/images/koala.gif")

  const leavingContent = (
    <>
      <View style={$infoBoxPositioningContainer}>
        <View
          style={{
            ...$infoBoxCustom,
            ...$infoBoxCustomBg,
            borderColor: colors.palette.neutral100,
            flexDirection: "row",
            width: "50%",
          }}
        >
          <Text
            weight="boldItalic"
            text="See you soon!"
            style={{ fontSize: typography.fontSizes.h5 }}
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
            shadowColor: pressed || deviceIsAndroid ? "transparent" : "#000",
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
    </View>
  )
})
