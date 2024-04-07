import { colors, spacing } from "app/theme"
import React from "react"
import { View, Text, StyleSheet } from "react-native"

const SeparatorWithText: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.separatorContainer}>
    <View style={styles.line} />
    <View style={styles.textWrapper}>
      <Text style={styles.text}>{text}</Text>
    </View>
    <View style={styles.line} />
  </View>
)

const hrColor = colors.palette.neutral800
const styles = StyleSheet.create({
  separatorContainer: {
    flexDirection: "row",
    marginVertical: spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    width: "100%",
    backgroundColor: hrColor, // Line color
    marginTop: 6,
  },
  textWrapper: {
    // backgroundColor: "white",
    marginHorizontal: 4,
  },
  text: {
    fontSize: 10,
    color: hrColor, // Text color
  },
})

export default SeparatorWithText
