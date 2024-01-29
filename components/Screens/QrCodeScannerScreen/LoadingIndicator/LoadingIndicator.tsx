import React from 'react'
import { Text, ActivityIndicator, StyleSheet } from 'react-native'

const LoadingIndicator = () => {
	return (
		<>
			<Text style={styles.text}>Running Security Checks...</Text>
		</>
	)
}

const styles = StyleSheet.create({
	text: {
		marginTop: 10, // You can adjust the space between the spinner and the text
		fontSize: 16,
		color: '#000', // Or any color you prefer
		// Add more styling as needed
	},
})
export default LoadingIndicator
