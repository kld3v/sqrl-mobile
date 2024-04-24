import React from "react"
import { qrScannerService } from "app/services/QrScanner"
import { ScanStateOptions } from "types"

import { Text } from "app/components/Text"
import { TextStyle } from "react-native"

const DisplayUrlText: React.FC<{ url: string; scanState: ScanStateOptions; style: TextStyle }> = ({
  url,
  scanState,
  style,
}) => {
  return (
    <>
      {url && scanState === "scanned" && (
        <Text
          style={style}
          preset="bold"
          text={`"${qrScannerService.getPrimaryDomainName(url)}"`}
        />
      )}
    </>
  )
}

export default DisplayUrlText
