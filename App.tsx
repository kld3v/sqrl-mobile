import { Button, StyleSheet, Text, View } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useEffect, useState } from 'react'
import axios from 'axios'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import { LocationObject } from 'expo-location'
import QrCodeScanner from './components/Screens/QrCodeScannerScreen/QrCodeScanner'
import LoadingIndicator from './components/Screens/QrCodeScannerScreen/LoadingIndicator'
import AfterScanModalDisplay from './components/Screens/QrCodeScannerScreen/AfterScanModalDisplay'
import DeviceDataCollection from './components/DataCollection/DeviceDataCollection'
import SettingsButton from './components/Navigation/SettingsButton/SettingsButton'
import InfoBoxWidget from './components/Screens/QrCodeScannerScreen/InfoBoxWidget/InfoBoxWidget'

const LOCATION_TASK_NAME = 'background-location-task'
const requestPermissions = async () => {
	try {
		const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync()
		if (foregroundStatus === 'granted') {
			console.info(`foregroundLocationPermission: ${foregroundStatus}`)
			const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync()
			if (backgroundStatus === 'granted') {
				console.info(`backgroundLocationPermission: ${backgroundStatus}`)
				await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
					accuracy: Location.Accuracy.Highest,
					timeInterval: 10000,
					distanceInterval: 2,
					activityType: 3,
				})
				console.info('background location services listening...')
			}
		}
	} catch (error) {
		console.error('Permissions Error:', error)
	}
}

// const PermissionsButton = () => (
// 	<View>
// 		<Button
// 			onPress={requestPermissions}
// 			title='Enable location services'
// 		/>
// 	</View>
// )

//@ts-ignore
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
	if (error) {
		console.error('Task Manager Error:', error.message)
		return
	}
	console.info(locations)
})

export default function App() {
	const [hasPermission, setHasPermission] = useState<string | boolean>('not_requested')
	const [scanned, setScanned] = useState<boolean>(false)
	const [url, setUrl] = useState<string>('')
	const [scanInProgress, setScanInProgress] = useState<boolean>(false)
	const [location, setLocation] = useState<LocationObject>()
	const [errorMsg, setErrorMsg] = useState<boolean | string>(false)
	const [showModal, setShowModal] = useState<boolean>(false)
	const [trustScore, setTrustScore] = useState<string | null>('hello')

	const [displayLocation, setDisplayLocation] = useState<string>('')
	const [displayName, setDisplayName] = useState<string>('')

	// Get User Permissions On App Launch
	useEffect(() => {
		;(async () => {
			try {
				const { status: permissionForUserCamera } = await BarCodeScanner.requestPermissionsAsync()
				setHasPermission(permissionForUserCamera === 'granted')
				if (permissionForUserCamera !== 'granted') {
					setErrorMsg('Permission to camera denied')
					return
				}

				// I'm acquring this on user launch. This is because it can take a few seconds to attain the location. If already attained, I can use the much quicker API call getLastKnownPositionAsync() when the user scans to reduce wait time.

				// However this is going to require some testing to ensure getLastKnownPositionAsync() returns this location rather than an incorrect location.
				const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync()
				let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation })
				setLocation(location)
				console.info(location)
			} catch (error) {
				console.error(error)
			}
		})()
	}, [])

	hasPermission === 'not_requested' && <Text>Requesting camera permission</Text>
	!hasPermission && <Text>Access to camera denied</Text>
	errorMsg && <Text>`Permission Denied: ${errorMsg}`</Text>

	const onScan = async ({ type, data }: { type: string; data: string }): Promise<void> => {
		setScanned(true)
		setScanInProgress(true)
		let location = await Location.getLastKnownPositionAsync({})
		if (!location) {
			alert('Failed to attain location: please scan again')
			return
		}
		setLocation(location)
		let { latitude, longitude, altitude } = location.coords
		try {
			setUrl(data)
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
			setTrustScore(JSON.stringify(res.data.trust_score))
			console.info(JSON.stringify(res.data.trust_score))

			try {
				let data = await DeviceDataCollection.collectAllData()
				console.info(data)
			} catch (error) {
				console.error(error)
			}
			setShowModal(true)
		} catch (error) {
			console.error(error)
			alert(`Error: ${error}`)
		}
		setScanInProgress(false)
	}

	return (
		<View style={styles.container}>
			<>
				<QrCodeScanner
					scanned={scanned}
					onScan={onScan}
				/>
				{/* <PermissionsButton /> */}
				{scanned && (
					<>
						<AfterScanModalDisplay
							showModal={showModal}
							setShowModal={setShowModal}
							trust_score={trustScore}
							url={url}
							setScanned={setScanned}
							setUrl={setUrl}
						/>
					</>
				)}
			</>
			<InfoBoxWidget />
			<SettingsButton />
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
