import { BarCodeScanner } from 'expo-barcode-scanner'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { QrCodeScannerProps } from '../../../../types/index'
const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ scanned, onScan }) => {
	return (
		<View style={styles.barcodeScanner}>
			<BarCodeScanner
				onBarCodeScanned={scanned ? undefined : onScan}
				style={StyleSheet.absoluteFillObject}
				testID='barcode-scanner'
			/>
		</View>
	)
}
const styles = StyleSheet.create({
	barcodeScanner: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 300,
		width: 300,
		overflow: 'hidden',
		borderRadius: 30,
		backgroundColor: 'green',
	},
})

export default QrCodeScanner
