export type ScanStateOptions = 'scanned' | 'notScanned' | 'scanning'

export type InfoBoxWidgetProps = {
	trustScore: number | null
	destination: string | null
	url: string
	safe: boolean
	scanState: ScanStateOptions
	setScanState: React.Dispatch<React.SetStateAction<ScanStateOptions>>
}
