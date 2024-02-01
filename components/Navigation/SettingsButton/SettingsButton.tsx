import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, View, StyleSheet } from 'react-native'

const SettingsButton: React.FC = () => {
	return (
		<View style={styles.settingsButton}>
			<Pressable onPress={handleSettingsPress}>
				<MaterialIcons
					name='more-vert'
					size={24}
					color='black'
				/>
			</Pressable>
		</View>
	)
}

export default SettingsButton

const styles = StyleSheet.create({
	settingsButton: {
		position: 'absolute',
		left: 25,
		bottom: 25,
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
})

function handleSettingsPress() {
	console.info('Settings button pressed')
}
