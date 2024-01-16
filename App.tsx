import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
	const [hasPermission, setHasPermission] = useState<string | boolean>('not_requested')
	const [scanned, setScanned] = useState<boolean>(false)
	const [link, setLink] = useState<string>('')
	const [scanInProgress, setScanInProgress] = useState<boolean>(false)

	useEffect(() => {
		;(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync()
			setHasPermission(status === 'granted')
		})()
	}, [])

	hasPermission === 'not_requested' && <Text>Requesting camera permission</Text>
	!hasPermission && <Text>Access to camera denied</Text>

	const onScan = async ({ type, data }: { type: string; data: string }): Promise<void> => {
		setScanned(true)
		setScanInProgress(true)

		try {
			setLink(data)
			const res = await axios.post(
				'http://192.168.10.151:8000/api/url',
				{
					url: data,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
				}
			)
			alert(`Response from BE: ${JSON.stringify(res.data)}`)
		} catch (error) {
			console.error(error)
			alert(`Error: ${error}`)
		}

		setScanInProgress(false)
	}

	const LoadingIndicator = (
		<>
			<ActivityIndicator
				size='large'
				color='#0000ff'
			/>
			<Text style={styles.text}>Running Security Checks...</Text>
		</>
	)

	return (
		<View style={styles.container}>
			{scanInProgress ? (
				LoadingIndicator
			) : (
				<>
					<View style={styles.barcodeScanner}>
						<BarCodeScanner
							onBarCodeScanned={scanned ? undefined : onScan}
							style={StyleSheet.absoluteFillObject}
						/>
					</View>
					{scanned && (
						<>
							<Text
								style={{ color: link.startsWith('http') ? 'green' : 'red' }}
								onPress={() => link.startsWith('http') && Linking.openURL(link)}>
								{link}
							</Text>

							<TouchableOpacity
								onPress={() => {
									setScanned(false)
									setLink('')
								}}>
								<Text style={{ fontSize: 24 }}>Scan Again?</Text>
							</TouchableOpacity>
						</>
					)}
				</>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	barcodeScanner: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 300,
		width: 300,
		overflow: 'hidden',
		borderRadius: 30,
		backgroundColor: 'green',
	},
	text: {
		marginTop: 10, // You can adjust the space between the spinner and the text
		fontSize: 16,
		color: '#000', // Or any color you prefer
		// Add more styling as needed
	},
})
