import { assetService } from "app/services/Assets/AssetService"
import { colors } from "app/theme"
import React from "react"
import { View, Image, Dimensions } from "react-native"

const LoadingOverlay = () => {
  const { height } = Dimensions.get("window")

  return (
    <View
      style={{
        height: "120%",
        width: "100%",
        position: "absolute",
        backgroundColor: colors.palette.overlay50,
        zIndex: 10,
        alignItems: "center",
      }}
    >
      <Image
        source={assetService.spinner}
        style={{ width: 50, height: 50, marginTop: height / 2 }}
      />
    </View>
  )
}

export default LoadingOverlay
