import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { ScanAgainButtonProps } from '../../../../types'

const ScanAgainButton: React.FC<ScanAgainButtonProps> = ({ setScanned, setLink }) => {
	const resetScannedAndLinkState = () => {
		return () => {
			setScanned(false)
			setLink('')
		}
	}
	return (
		<TouchableOpacity onPress={resetScannedAndLinkState()}>
			<Text style={{ fontSize: 24 }}>Scan Again?</Text>
		</TouchableOpacity>
	)
}

export default ScanAgainButton
