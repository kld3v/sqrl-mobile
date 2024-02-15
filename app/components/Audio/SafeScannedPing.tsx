import React, { useEffect, useState } from "react"
import { Audio } from "expo-av"

const SafeScannedPing = () => {
  const [sound, setSound] = useState<Audio.Sound>()
  async function PlaySuccessfulScan() {
    try {
      // This could be improved - the sound should be loaded once and then played multiple times
      const { sound } = await Audio.Sound.createAsync(require("./ping.mp3"))
      setSound(sound)
      try {
        await sound.playAsync()
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  useEffect(() => {
    PlaySuccessfulScan()
  }, [])
  return <></>
}

export default SafeScannedPing
