import { BarCodeScanner } from 'expo-barcode-scanner'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { QrCodeScannerProps } from '../../../../types/index'

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ scanned, onScan }) => {
	return (
		<View style={StyleSheet.absoluteFillObject}>
			<BarCodeScanner
				onBarCodeScanned={scanned ? undefined : onScan}
				style={StyleSheet.absoluteFillObject}
				testID='barcode-scanner'
			/>
			<View style={styles.reticule}>
				<View style={styles.cornerTopLeft} />
				<View style={styles.cornerTopRight} />
				<View style={styles.cornerBottomLeft} />
				<View style={styles.cornerBottomRight} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	reticule: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		width: 200,
		height: 200,
		marginLeft: -100, // half of width to center
		marginTop: -100, // half of height to center
	},
	cornerTopLeft: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 50,
		height: 50,
		borderTopWidth: 8,
		borderLeftWidth: 8,
		borderColor: 'white',
		borderTopLeftRadius: 10,
	},
	cornerTopRight: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 50,
		height: 50,
		borderTopWidth: 8,
		borderRightWidth: 8,
		borderColor: 'white',
		borderTopRightRadius: 10,
	},
	cornerBottomLeft: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: 50,
		height: 50,
		borderBottomWidth: 8,
		borderLeftWidth: 8,
		borderColor: 'white',
		borderBottomLeftRadius: 10,
	},
	cornerBottomRight: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 50,
		height: 50,
		borderBottomWidth: 8,
		borderRightWidth: 8,
		borderColor: 'white',
		borderBottomRightRadius: 10,
	},
})

export default QrCodeScanner
