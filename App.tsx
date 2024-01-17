import {  StyleSheet, Text, , View } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useEffect, useState } from 'react'
import axios from 'axios'
import * as Location from 'expo-location'
import { LocationObject } from 'expo-location'
import QrCodeScanner from './components/QrCodeScanner'
import UrlDisplay from './components/UrlDisplay'
import LoadingIndicator from './components/LoadingIndicator'
import ScanAgainButton from './components/ScanAgainButton'

export default function App() {
	const [hasPermission, setHasPermission] = useState<string | boolean>('not_requested')
	const [scanned, setScanned] = useState<boolean>(false)
	const [link, setLink] = useState<string>('')
	const [scanInProgress, setScanInProgress] = useState<boolean>(false)
	const [location, setLocation] = useState<LocationObject>()
	const [errorMsg, setErrorMsg] = useState<boolean | string>(false)

	// Get User Permissions On App Launch
	useEffect(() => {
		;(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync()
			setHasPermission(status === 'granted')
		})()
		;(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') {
				setErrorMsg('Permission to location denied')
				return
			}
		})()
	}, [])

	hasPermission === 'not_requested' && <Text>Requesting camera permission</Text>
	!hasPermission && <Text>Access to camera denied</Text>
	errorMsg && <Text>`Permission Denied: ${errorMsg}`</Text>

	const onScan = async ({ type, data }: { type: string; data: string }): Promise<void> => {
		setScanned(true)
		setScanInProgress(true)
		let location = await Location.getCurrentPositionAsync({})
		setLocation(location)
		let { latitude, longitude, altitude } = location.coords
		try {
			setLink(data)
			const res = await axios.post(
				'http://192.168.10.151:8000/api/receiveUrlData',
				{
					url: data,
					location: {
						latitude,
						longitude,
						altitude,
					},
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

	return (
		<View style={styles.container}>
			{scanInProgress ? (
				<LoadingIndicator />
			) : (
				<>
					<QrCodeScanner
						scanned={scanned}
						onScan={onScan}
					/>
					{scanned && (
						<>
							<UrlDisplay link={link} />
							<ScanAgainButton setScanned={setScanned} setLink={setLink} />
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
})
