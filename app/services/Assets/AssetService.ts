import { AnimationObject } from "lottie-react-native"
import { ImageSourcePropType, ImageURISource } from "react-native"

class AssetService {
  qrlaLogo: ImageSourcePropType | undefined
  spinner: ImageSourcePropType | undefined
  leafFallAnimation: string | AnimationObject | { uri: string }
  koalaCheckingAnimation: AnimationObject
  shep: { source: ImageURISource; width: number; height: number } | undefined
  constructor() {
    this.qrlaLogo = require("../../../assets/images/winkface.png")
    this.spinner = require("../../../assets/images/spinner.gif")
    this.leafFallAnimation = require("../../../assets/animations/leafFall.json")
    this.koalaCheckingAnimation = require("../../../assets/animations/checking.json")
    this.shep = {
      source: require("../../../assets/images/cook.jpg"),
      width: 50, // Set the width you want
      height: 50, // Set the height you want (keeping aspect ratio if necessary)
    }
  }
}

export const assetService = new AssetService()
