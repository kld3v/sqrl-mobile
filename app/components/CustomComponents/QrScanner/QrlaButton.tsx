import React from "react"
import { Pressable } from "react-native"
import { $qrlaButton } from "./QrScannerStyles"
import * as WebBrowser from "expo-web-browser"
import { AutoImage } from "../../AutoImage"
import { useNavigation } from "@react-navigation/native"
import { assetService } from "app/services/Assets/AssetService"

const QrlaButton = () => {
  const navigation = useNavigation()
  return (
    <Pressable
      style={$qrlaButton}
      // @ts-ignore
      onLongPress={() => navigation.navigate("Debug")}
      onPress={async () => await WebBrowser.openBrowserAsync("https://www.qrla.io")}
      delayLongPress={10000}
    >
      <AutoImage
        style={{
          height: 56,
          width: 56,
        }}
        source={assetService.qrlaLogo}
        resizeMode="contain"
      />
    </Pressable>
  )
}

export default QrlaButton
