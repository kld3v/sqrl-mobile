export type InfoBoxWidgetProps = {
	trustScore: number
	destination: string | null
	url: string
	safe: boolean
	scanState: 'scanned' | 'notScanned' | 'scanning'
}
