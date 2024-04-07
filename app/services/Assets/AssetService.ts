import { ImageSourcePropType } from "react-native"

class AssetService {
  qrlaLogo: ImageSourcePropType | undefined

  constructor() {
    this.qrlaLogo = require("../../../assets/images/winkface.png")
  }
}

export const assetService = new AssetService()
