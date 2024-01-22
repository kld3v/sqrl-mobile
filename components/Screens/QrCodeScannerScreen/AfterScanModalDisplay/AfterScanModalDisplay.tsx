import React from 'react'
import { AfterScanModalDisplayProps } from '../../../../types/afterScanModalDisplay'
import { Modal, View, Text, Pressable, Linking, StyleSheet } from 'react-native'

const AfterScanModalDisplay: React.FC<AfterScanModalDisplayProps> = ({ showModal, setShowModal, trust_score, url, setScanned, setUrl }) => {
	const openLink = () => {
		url && trust_score && Linking.openURL(url)
	}

	const resetScanAndLinkStateAndCloseModal = () => {
		return () => {
			setShowModal(!showModal)
			setScanned(false)
			setUrl('')
		}
	}
	return (
		<View style={styles.centeredView}>
			<Modal
				animationType='fade'
				transparent={true}
				visible={showModal}
				onRequestClose={() => setShowModal(false)}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Trust Score: {trust_score}</Text>
						<Text>{url}</Text>
						<Pressable
							style={[styles.button, styles.buttonProceed]}
							onPress={openLink}>
							<Text>Proceed to URL</Text>
						</Pressable>
						<Pressable
							style={[styles.button, styles.buttonClose]}
							onPress={resetScanAndLinkStateAndCloseModal()}>
							<Text style={styles.textStyle}>Hide</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</View>
	)
}

export default AfterScanModalDisplay

const styles = StyleSheet.create({
	centeredView: {
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonProceed: {
		backgroundColor: '#D0F0C0',
		marginBottom: 24,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
})
