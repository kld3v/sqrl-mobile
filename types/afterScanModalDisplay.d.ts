export type AfterScanModalDisplayProps = {
	showModal: boolean
	trust_score: string | null
	url: string
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>
	setScanned: React.Dispatch<React.SetStateAction<boolean>>
	setUrl: React.Dispatch<React.SetStateAction<string>>
}
