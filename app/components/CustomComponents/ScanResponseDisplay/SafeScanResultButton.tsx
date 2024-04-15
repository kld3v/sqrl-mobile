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
          backgroundColor: colors.palette.primary500,
          borderRadius: 25, // Half of the height
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        raisedButtonEdgeStyle={{
          backgroundColor: colors.palette.primary600,
        }}
        textStyle={{
          color: "#442b48",
          fontSize: typography.fontSizes.h5,
          fontFamily: typography.primary.bold,
          paddingTop: 12,
        }}
      />
      <OnScanHaptic scanState={scanState} safe={safe} />
    </>
  )
}

export default SafeScanResultButton
