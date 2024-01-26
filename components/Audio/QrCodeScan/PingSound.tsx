import React, { Ref, forwardRef, useImperativeHandle, useState } from 'react'

const PingSound: React.FC<{}> = () => {
	const [sound, setSound] = useState()

	const playSound = async () => {
		const { sound } = await Audio.Sound.createAsync(require('./assets/sounds/ping.mp3'))
		setSound(sound)
		await sound.playAsync()
	}


	// Clean Up
	React.useEffect(() => {
		return sound
			? () => {
					sound.unloadAsync()
			  }
			: undefined
	}, [sound])

	return <></>
})

export default PingSound
