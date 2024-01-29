import React, { useState } from 'react'
import { Linking, Pressable, StyleSheet, Text, View, Image } from 'react-native'
import { InfoBoxWidgetProps } from '../../../../types'
import { Feather, AntDesign } from '@expo/vector-icons'

const InfoBoxWidget: React.FC<InfoBoxWidgetProps> = ({ trustScore, destination, url, scanState = 'notScanned', safe, setScanState }) => {
	const iconSize = 64
	const [leaving, setLeaving] = useState(false)

	const setDelayedLeaving = (): void => {
		setLeaving(true)
		setTimeout(() => Linking.openURL(url), 2000)
	}

	return leaving ? (
		<View style={styles.infoBox}>
			<View style={styles.textAndButton}>
				<Text style={styles.infoText}>See Ya next time! </Text>
			</View>
		</View>
	) : (
		<View style={styles.infoBox}>
			<View style={styles.textAndButton}>
				<Text style={styles.infoText}>{trustScore && `trust score: ${trustScore}`} </Text>
				<Pressable onPress={() => setDelayedLeaving()}>
					<Text>Go To {destination}</Text>
				</Pressable>
				<Pressable onPress={() => setScanState('notScanned')}>
					<Text>Scan Again</Text>
				</Pressable>
			</View>
			{scanState === 'scanning' && (
				<Image
					source={require('./loading.gif')}
					style={{ width: iconSize, height: iconSize }}
				/>
			)}
			{scanState === 'scanned' && safe && (
				<Feather
					name='check-circle'
					size={iconSize}
					color={'green'}
				/>
			)}
			{scanState === 'scanned' && !safe && (
				<Feather
					name='alert-circle'
					size={iconSize}
					color={'red'}
				/>
			)}
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
