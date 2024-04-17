import { Button } from "app/components"
import { spacing, colors, typography } from "app/theme"
import React from "react"
import { View } from "react-native"

const UnSafeScanResultButton: React.FC<{
  resetScanState: () => void
}> = ({ resetScanState }) => {
  return (
    <View style={{ marginTop: spacing.md, marginBottom: spacing.xxl }}>
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
        raisedButtonEdgeStyle={{ backgroundColor: colors.palette.angry500Pressed }}
        textStyle={{ fontFamily: typography.primary.bold }}
      />
    </View>
  )
}

export default UnSafeScanResultButton
