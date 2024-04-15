import { AutoImage } from "app/components/AutoImage"
import { Button } from "app/components/Button"
import OnScanHaptic from "app/components/Haptics/OnScanHaptic"
import Proceed from "app/components/Svg/Proceed"
import { assetService } from "app/services/Assets/AssetService"
import { colors, spacing, typography } from "app/theme"
import React from "react"
import { Image, View } from "react-native"
import { ScanStateOptions } from "types"

const SafeScanResultButton: React.FC<{
  setDelayedLeaving: () => void
  setPressed: any
  scanState: ScanStateOptions
  safe: boolean
}> = ({ setDelayedLeaving, setPressed, scanState, safe }) => {
  return (
    <View style={{ marginTop: spacing.xxxl }}>
      <Button
        text="Proceed"
        onPress={setDelayedLeaving}
        style={{
          backgroundColor: colors.palette.primary500,
          borderRadius: 32, // Half of the height
          justifyContent: "center",
          alignItems: "center",
          // paddingHorizontal: 64,
          height: 64,
          width: 230,
          marginTop: -12,
        }}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        raisedButtonEdgeStyle={{
          backgroundColor: "#5D862C",
          height: 64,
          width: 230,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 32, // Half of the height
        }}
        textStyle={{
          color: "#442b48",
          fontSize: typography.fontSizes.h3,
          fontFamily: typography.primary.bold,

          // backgroundColor: "#fff",
        }}
        streak
      >
        <Proceed style={{ zIndex: 2 }} />
      </Button>
      <OnScanHaptic scanState={scanState} safe={safe} />
    </View>
  )
}

export default SafeScanResultButton
