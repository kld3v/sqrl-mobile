import { ImageSourcePropType } from "react-native"

class AssetService {
  qrlaLogo: ImageSourcePropType | undefined
  spinner: ImageSourcePropType | undefined

  constructor() {
    this.qrlaLogo = require("../../../assets/images/winkface.png")
    this.spinner = require("../../../assets/images/spinner.gif")
  }
}

export const assetService = new AssetService()
