import { Platform, Pressable, View } from "react-native"
import { observer } from "mobx-react-lite"

import { BarCodeScanningResult, Camera } from "expo-camera"
import { ScanResponseDisplay } from "../ScanResponseDisplay/ScanResponseDisplay"
import { Reticle } from "../Reticle"
import useScanResults from "./useScanResults"
import { $card, $container, $reticle } from "./QrScannerStyles"
import RefreshButton from "./RefreshButton"
import { CameraView } from "expo-camera/next"
import React from "react"
import Slider from "@react-native-community/slider"
import { assetService } from "app/services/Assets/AssetService"
import * as Haptics from "expo-haptics"
import { colors } from "app/theme"
import MultiSlider from "@ptomasroos/react-native-multi-slider"

export const QrScanner = observer(function QrScanner() {
  const {
    scanAgain,
    errorMsg,
    onScan,
    setErrorMsg,
    safe,
    readyToScan,
    scanState,
    setScanState,
    url,
    focus,
    updateCameraFocus,
    setCancelMidScan,
    zoom,
    setZoom,
  } = useScanResults()

  const handleScan = (barcodeScanResult: BarCodeScanningResult) => {
    if (readyToScan.current) {
      onScan(barcodeScanResult)
    }
  }

  return (
    <View style={$container}>
      <Pressable style={{ flex: 1 }} onPress={updateCameraFocus}>
        {Platform.OS === "ios" ? (
          <Camera style={{ flex: 1 }} onBarCodeScanned={handleScan} autoFocus={focus} zoom={zoom} />
        ) : (
          // <CameraView style={{ flex: 1 }} onBarcodeScanned={handleScan} zoom={zoom} />
          <></>
        )}

        <Reticle
          style={$reticle}
          scanState={scanState}
          safe={safe}
          scanning={scanState === "scanning"}
        />
      </Pressable>

      {scanState !== "notScanned" && (
        <ScanResponseDisplay
          style={$card}
          url={url}
          scanState={scanState}
          safe={safe}
          setScanState={setScanState}
          setErrorMessage={setErrorMsg}
          errorMessage={errorMsg}
          readyToScan={readyToScan}
          setCancelMidScan={setCancelMidScan}
        />
      )}
      <RefreshButton safe={safe} scanState={scanState} scanAgain={scanAgain} />
      {scanState === "notScanned" && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute", // Ensure the slider is overlaid on the camera view
            bottom: 20, // Position at the bottom or as needed
          }}
        >
          {Platform.OS === "ios" ? (
            <Slider
              style={{ width: "88%", height: 40 }}
              minimumValue={0}
              maximumValue={0.4}
              minimumTrackTintColor={colors.palette.primary500}
              maximumTrackTintColor={colors.palette.neutral200}
              onValueChange={(value: number) => {
                setZoom(value)
                console.log("on value change")
              }}
              //ios only
              tapToSeek
              onSlidingStart={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }}
              onSlidingComplete={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              }}
            />
          ) : (
            <MultiSlider
              min={0}
              max={0.4}
              step={0.05}
              onValuesChange={(values) => {
                setZoom(values[0])
              }}
              onValuesChangeStart={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }}
              onValuesChangeFinish={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              }}
              markerStyle={{
                backgroundColor: "white",
                height: 24,
                width: 24,
              }}
              trackStyle={{
                backgroundColor: colors.background,
              }}
              selectedStyle={{
                backgroundColor: colors.textGreen,
              }}
            />
          )}
        </View>
      )}
    </View>
  )
})
