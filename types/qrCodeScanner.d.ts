export type QrCodeScannerProps = {
	scanned: boolean
	onScan: ({ type, data }: { type: string; data: string }) => Promise<void>
}
