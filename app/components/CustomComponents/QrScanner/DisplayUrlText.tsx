import React from "react"
import { $subReticuleUrlStyle } from "./QrScannerStyles"
import { qrScannerService } from "app/services/QrScanner"
import { ScanStateOptions } from "types"

import { Text } from "app/components/Text"
const DisplayUrlText: React.FC<{ url: string; scanState: ScanStateOptions }> = ({
  url,
  scanState,
}) => {
  return (
    <>
      {url && scanState === "scanned" && (
        <Text
          weight="boldItalic"
          style={$subReticuleUrlStyle}
        >{`"${qrScannerService.getPrimaryDomainName(url)}"`}</Text>
      )}
    </>
  )
}

export default DisplayUrlText
