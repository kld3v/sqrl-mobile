import React from "react"
import { Pressable } from "react-native"
import { $qrlaButton } from "./QrScannerStyles"
import * as WebBrowser from "expo-web-browser"
import { AutoImage } from "../../AutoImage"
import { useNavigation } from "@react-navigation/native"
import { quintonTheCybear } from "app/utils/QuintonTheCybear"

const QrlaButton = () => {
  const navigation = useNavigation()
  quintonTheCybear.log("qrla button rendered")
  return (
    <Pressable
      style={$qrlaButton}
      // @ts-ignore
      onLongPress={() => navigation.navigate("Debug")}
      onPress={async () => await WebBrowser.openBrowserAsync("https://www.qrla.io")}
    >
      <AutoImage
        style={{
          height: 56,
          width: 56,
        }}
        source={require("../../../../assets/images/winkface.png")}
        resizeMode="contain"
      />
    </Pressable>
  )
}

export default QrlaButton
