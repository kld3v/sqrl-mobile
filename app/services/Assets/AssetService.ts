import { AnimationObject } from "lottie-react-native"
import { ImageSourcePropType } from "react-native"

class AssetService {
  qrlaLogo: ImageSourcePropType | undefined
  spinner: ImageSourcePropType | undefined
  leafFallAnimation: string | AnimationObject | { uri: string }

  constructor() {
    this.qrlaLogo = require("../../../assets/images/winkface.png")
    this.spinner = require("../../../assets/images/spinner.gif")
    this.leafFallAnimation = require("../../../assets/animations/leafFall.json")
  }
}

export const assetService = new AssetService()
