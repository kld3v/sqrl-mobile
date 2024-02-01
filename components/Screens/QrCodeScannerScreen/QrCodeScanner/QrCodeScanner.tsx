import { BarCodeScanner } from 'expo-barcode-scanner'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { QrCodeScannerProps } from '../../../../types/index'

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ scanned, onScan, scanState, safe }) => {
	const Corner = ({ position, scanning }: { position: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight'; scanning: boolean; safe: boolean }) => (
		<View style={[styles[`corner${position}`], scanning && styles.scanningCorner, scanState === 'scanned' ? (safe ? styles.scannedSafe : styles.scannedUnsafe) : null]} />
	)
	return (
		<View style={StyleSheet.absoluteFillObject}>
			<BarCodeScanner
				onBarCodeScanned={scanned ? undefined : onScan}
				style={StyleSheet.absoluteFillObject}
				testID='barcode-scanner'
			/>
			<View style={styles.reticule}>
				<Corner
					position='TopLeft'
					scanning={scanState === 'scanning'}
					safe={safe}
				/>
				<Corner
					position='TopRight'
					scanning={scanState === 'scanning'}
					safe={safe}
				/>
				<Corner
					position='BottomLeft'
					scanning={scanState === 'scanning'}
					safe={safe}
				/>
				<Corner
					position='BottomRight'
					scanning={scanState === 'scanning'}
					safe={safe}
				/>
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
		width: 32,
		height: 32,
		borderTopWidth: 8,
		borderLeftWidth: 8,
		borderColor: 'white',
		borderTopLeftRadius: 10,
	},
	cornerTopRight: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 32,
		height: 32,
		borderTopWidth: 8,
		borderRightWidth: 8,
		borderColor: 'white',
		borderTopRightRadius: 10,
	},
	cornerBottomLeft: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: 32,
		height: 32,
		borderBottomWidth: 8,
		borderLeftWidth: 8,
		borderColor: 'white',
		borderBottomLeftRadius: 10,
	},
	cornerBottomRight: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 32,
		height: 32,
		borderBottomWidth: 8,
		borderRightWidth: 8,
		borderColor: 'white',
		borderBottomRightRadius: 10,
	},
	scanningCorner: {
		borderColor: '#73c408',
	},
	scannedUnsafe: {
		borderColor: '#eb4034',
	},
	scannedSafe: {
		borderColor: '#a2f732',
	},
})

export default QrCodeScanner
