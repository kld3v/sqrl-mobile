import { useStores } from "app/models"
import { secureStoreInstance } from "app/services/SecureStore/SecureStorageService"
import { useEffect } from "react"

export default () => {
  const { onboardingStore } = useStores()
  useEffect(() => {
    let hasOnboarded
    ;(async () => {
      hasOnboarded = await secureStoreInstance.getValueFromSecureStore("hasOnboarded")
      if (!hasOnboarded) {
        onboardingStore.setHasOnboarded(false)
      }
    })()
  }, [])
}
