import * as React from "react"
import { Linking, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useState, useEffect, useRef } from "react"
import { Platform } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { useStores } from "app/models"
export interface PushNotificationsManagerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const PushNotificationsManager = observer(function PushNotificationsManager(
  props: PushNotificationsManagerProps,
) {
  const { pushNotificationsStore } = useStores()

  useEffect(() => {}, [])

  return <></>
})
