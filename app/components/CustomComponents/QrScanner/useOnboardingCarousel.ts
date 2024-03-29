import { useState, useEffect } from "react"
import { Asset } from "expo-asset"
import { secureStoreInstance } from "app/services/SecureStore/SecureStorageService"
import { useStores } from "app/models"

export default () => {
  const { onboardingStore } = useStores()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    require("../../../../assets/images/onBoardingImages/checking.jpeg"),
    require("../../../../assets/images/onBoardingImages/goodToGo.jpeg"),
    require("../../../../assets/images/onBoardingImages/eqr.jpeg"),
    require("../../../../assets/images/onBoardingImages/caution.jpeg"),
    require("../../../../assets/images/onBoardingImages/caution.jpeg"),
  ]

  const text = [
    "Hold the camera up to QR code for scanning.",
    "If the QR code is safe, go ahead to the destination by clicking on the proceed button.",
    "Skip scanning! Utilise our EQR feature for instant access to the right QR code at your location.",
    "If the QR code is flagged as dangerous, we advice against proceeding to the site.",
    "Earn a leaf on every scan and become the top scanner for your area!",
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
