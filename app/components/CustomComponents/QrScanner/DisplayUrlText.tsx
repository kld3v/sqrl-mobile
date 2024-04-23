import React from "react"
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
        <Text preset="bold">{`"${qrScannerService.getPrimaryDomainName(url)}"`}</Text>
      )}
    </>
  )
}

export default DisplayUrlText
