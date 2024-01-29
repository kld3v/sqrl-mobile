import React from 'react'
import { Button, Linking, StyleSheet, Text, View } from 'react-native'
import { InfoBoxWidgetProps } from '../../../../types'
import { MaterialIcons, Feather, AntDesign } from '@expo/vector-icons'

const InfoBoxWidget: React.FC<InfoBoxWidgetProps> = ({ trustScore, destination, url, scanState = 'notScanned', safe }) => {
	return (
		<View style={styles.infoBox}>
			<View style={styles.textAndButton}>
				<Text style={styles.infoText}>Trust Score: {trustScore} </Text>
				<Button
					title='Go to URL'
					onPress={() => Linking.openURL(url)}
				/>
			</View>
			{scanState === 'scanning' && (
				<AntDesign
					size={56}
					name='qrcode'
				/>
			)}
			{scanState === 'scanned' && safe ? (
				<Feather
					name='check-circle'
					size={56}
					color={'green'}
				/>
			) : (
				<Feather
					name='alert-circle'
					size={56}
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
		height: 88,
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
	},
	checkCircle: {
		flex: 1,
	},
})
