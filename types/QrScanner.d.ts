export type ScanStateOptions = 'scanned' | 'notScanned' | 'scanning'

// Intentional excess type checking
export type InfoBoxWidgetProps = {
	trustScore: number | null
	destination: string | null
	url: string
	safe: boolean
	scanState: ScanStateOptions
	setScanState: React.Dispatch<React.SetStateAction<ScanStateOptions>>
	errorMessage: string | null
	setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
}
