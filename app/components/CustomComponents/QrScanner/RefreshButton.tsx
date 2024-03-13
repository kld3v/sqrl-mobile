import React from "react"
import { Pressable, View } from "react-native"
import { ScanStateOptions } from "types"
import { $refresh } from "./QrScannerStyles"
import Refresh from "app/components/Svg/Refresh"

const RefreshButton: React.FC<{
  safe: boolean
  scanState: ScanStateOptions
  scanAgain: () => void
}> = ({ safe, scanState, scanAgain }) => {
  return (
    <>
      {safe && scanState === "scanned" && (
        <View style={$refresh}>
          <Pressable onPress={scanAgain}>
            <Refresh />
          </Pressable>
        </View>
      )}
    </>
  )
}

export default RefreshButton
