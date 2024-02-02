import React, { useEffect } from 'react'
import * as Haptics from 'expo-haptics'

const SafeScannedHaptic = () => {
	useEffect(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
	}, [])

	return <></>
}

export default SafeScannedHaptic
