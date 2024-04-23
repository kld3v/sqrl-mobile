import React from "react"
import { View, StyleSheet, TouchableHighlight, Dimensions } from "react-native"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const totalTabs = state.routes.length
  const { width } = Dimensions.get("window")

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isMiddle = index === Math.floor(totalTabs / 2)

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <TouchableHighlight
            key={route.key}
            onPress={onPress}
            style={isMiddle ? styles.mound : styles.tabItem}
          >
            {/* Render your icon based on `options.tabBarIcon` and `label` here */}
          </TouchableHighlight>
        )
      })}
    </View>
  )
}

export default CustomTabBar

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white", // Customize as needed
    height: 60, // Customize as needed
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mound: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white", // Customize as needed
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // Adjust to make the mound "pop out"
    // Additional styling for shadow or elevation as needed
  },
  // Add styles for your icons and labels as needed
})
