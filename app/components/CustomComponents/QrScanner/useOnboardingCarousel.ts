import { useState, useEffect } from "react"
import { Asset } from "expo-asset"
import { secureStoreInstance } from "app/services/SecureStore/SecureStorageService"
import { useStores } from "app/models"

export default () => {
  const { onboardingStore } = useStores()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    require("../../../../assets/images/onBoardingImages/normal.png"),
    require("../../../../assets/images/onBoardingImages/checking.png"),
    require("../../../../assets/images/onBoardingImages/goodToGo.png"),
    require("../../../../assets/images/onBoardingImages/caution.png"),
    require("../../../../assets/images/onBoardingImages/eqr.png"),
    require("../../../../assets/images/onBoardingImages/history.png"),
    require("../../../../assets/images/onBoardingImages/leaderboard.png"),
  ]

  const text = [
    "Hold the camera up to QR code for scanning.",
    "Wait a couple of seconds while we check the QR code.",
    "If the QR code is safe, go ahead to the destination.",
    "If the QR code is flagged as dangerous, we advise against proceeding to the site.",
    "Skip scanning! Utilise our EQR feature for instant access to the right QR code at your location!",
    "View your previous scans for quick access with our 'History' page.",
    "Compete and climb your way up the leaderboard to become a Top Scanner!",
  ]

  const onNextPress = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const onBackPress = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const onFinishedOnboardingPress = () => {
    secureStoreInstance.setValueInSecureStore("hasOnboarded", "true")
    onboardingStore.setHasOnboarded(true)
  }

  const preloadImages = async () => {
    const imageAssets = images.map((image) => Asset.fromModule(image).downloadAsync())
    try {
      await Promise.all(imageAssets)
    } catch (error) {
      console.error("Error preloading images:", error)
    }
  }

  useEffect(() => {
    preloadImages()
  }, [])

  return {
    currentImageIndex,
    images,
    text,
    onNextPress,
    onBackPress,
    onFinishedOnboardingPress,
  }
}
