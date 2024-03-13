import SafeScannedPing from "app/components/Audio/SafeScannedPing"
import { Button } from "app/components/Button"
import OnScanHaptic from "app/components/Haptics/OnScanHaptic"
import { colors, typography } from "app/theme"
import React from "react"
import { ScanStateOptions } from "types"

const SafeScanResultButton: React.FC<{
  setDelayedLeaving: () => void
  setPressed: any
  scanState: ScanStateOptions
  safe: boolean
}> = ({ setDelayedLeaving, setPressed, scanState, safe }) => {
  return (
    <>
      <Button
        tx="scannerScreen.proceedButton"
        onPress={setDelayedLeaving}
        style={{
          backgroundColor: colors.palette.primary600,
          borderRadius: 25, // Half of the height
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
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
  )
}

export default SafeScanResultButton
