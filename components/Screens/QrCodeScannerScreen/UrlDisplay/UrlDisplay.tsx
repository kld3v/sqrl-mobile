import React from 'react'
import { Text, Linking } from 'react-native'
import { UrlDisplayProps } from '../../../../types/index'
const UrlDisplay: React.FC<UrlDisplayProps> = ({ link }) => {
	return (
		<Text
			style={{ color: link.startsWith('http') ? 'green' : 'red' }}
			onPress={() => link.startsWith('http') && Linking.openURL(link)}>
			{link}
		</Text>
	)
}

export default UrlDisplay
