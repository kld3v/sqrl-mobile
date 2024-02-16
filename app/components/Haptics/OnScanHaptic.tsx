import React, { useEffect } from "react"
import * as Haptics from "expo-haptics"
import { ScanStateOptions } from "types"

const OnScanHaptic: React.FC<{ scanState: ScanStateOptions; safe?: boolean }> = ({
  scanState,
  safe,
}) => {
  useEffect(() => {
    switch (scanState) {
      case "scanning":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        break
      case "scanned":
        safe
          ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

        break
      default:
        break
    }
  }, [])

  return <></>
}

export default OnScanHaptic
