import React, { useState } from 'react'
import { Linking, Pressable, StyleSheet, Text, View, Image } from 'react-native'
import { InfoBoxWidgetProps } from '../../../../types'
import { Feather } from '@expo/vector-icons'
import SafeScannedPing from '../../../Audio/SafeScannedPing'
import SafeScannedHaptic from '../../../Haptics/SafeScannedHaptic'

const InfoBoxWidget: React.FC<InfoBoxWidgetProps> = ({ trustScore, destination, url, scanState = 'notScanned', safe, setScanState, errorMessage, setErrorMessage }) => {
	const iconSize = 64
	const [leaving, setLeaving] = useState(false)

	const setDelayedLeaving = (): void => {
		setLeaving(true)
		setTimeout(() => Linking.openURL(url), 2000)
	}

	const scanAgain =
		(errorMessage: string | null): (() => void) =>
		(): void => {
			setScanState('notScanned')
			errorMessage && setErrorMessage(null)
		}

	if (leaving)
		return (
			<View style={styles.infoBox}>
				<View style={styles.textAndButton}>
					<Text style={styles.infoText}>Leaving...</Text>
				</View>
			</View>
		)

	if (errorMessage)
		return (
			<View style={styles.infoBox}>
				<View style={styles.textAndButton}>
					<Pressable onPress={scanAgain(errorMessage)}>
						<Text>{errorMessage}</Text>
					</Pressable>
				</View>
			</View>
		)

	const scannedState = (
		<>
			<View style={styles.textAndButton}>
				<Text style={styles.infoText}>{trustScore && `trust score: ${trustScore}`} </Text>
				<Pressable onPress={() => setDelayedLeaving()}>
					<Text>
						{safe ? 'Go to' : 'Still proceed to'} {destination}
					</Text>
				</Pressable>
				<Pressable onPress={scanAgain(errorMessage)}>
					<Text>Scan Again</Text>
				</Pressable>
				<SafeScannedPing />
				<SafeScannedHaptic />
			</View>
			{safe ? (
				<Feather
					name='check-circle'
					size={iconSize}
					color={'#a2f732'}
				/>
			) : (
				<Feather
					name='alert-circle'
					size={iconSize}
					color={'#eb4034'}
				/>
			)}
		</>
	)

	const scanningState = (
		<>
			<View style={styles.textAndButton}>
				<Text style={styles.infoText}>Scanning...</Text>
				<Pressable onPress={scanAgain(errorMessage)}>
					<Text>Cancel</Text>
				</Pressable>
			</View>
			<Image
				source={require('./loading.gif')}
				style={{ width: iconSize, height: iconSize }}
			/>
		</>
	)

	return (
		<View style={styles.infoBox}>
			{scanState === 'scanning' && scanningState}
			{scanState === 'scanned' && scannedState}
		</View>
	)
}

export default InfoBoxWidget

const styles = StyleSheet.create({
	infoBox: {
		position: 'absolute',
		left: '10%',
		right: '10%',
		bottom: 116,
		width: '80%', // adjust this value as needed
		height: 96,
		padding: 16,
		backgroundColor: 'white',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3,
		flexDirection: 'row',
	},
	infoText: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 16,
	},
	textAndButton: {
		flex: 2,
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	checkCircle: {
		flex: 1,
	},
})
