// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#041522",
  neutral300: "#435F7F",
  neutral400: "#566573",
  neutral500: "#7B8A99",
  neutral600: "#99A3A4",
  neutral700: "#A2AFB8",
  neutral800: "#D6DBDF",
  neutral900: "#E1E5E8",

  bluePressable: "#21569C",

  primary100: "#D7F2C2",
  primary200: "#B4E89C",
  primary300: "#92DD75",
  primary400: "#71D255",
  primary500: "#a2f732",
  primary600: "#8BC34A",
  primary700: "#689F38",
  primary800: "#4D7C2F",

  secondary100: "#E7B2C3",
  secondary200: "#D485A1",
  secondary300: "#C1587E",
  secondary400: "#AD2B5B",
  secondary500: "#a61856",

  accent100: "#FFEEF0",
  accent200: "#FFD4E5",
  accent300: "#FFB9DA",
  accent400: "#FF9ECE",
  accent500: "#FF83C2",

  angry100: "#F8D7DA",
  angry500: "#D32F2F",
  angry500Pressed: "#931F1F",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.7)",

  tableBorder: "rgba(215, 242, 194, 0.5)",

  heartRed: "#ea3b52",

  mattColorsBlue: "#1A2E3D",
  mattColorsDarkGreen: "#2c4e26",
  mattColorsTeaGreen: "#E1f0C1",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The primary text color used against dark backdrop.
  8.8:1 Wcag AAA grade
   */
  textGreen: palette.primary600,
  /**
   * The primary text color used against light backdrop.
   */
  textLightBg: palette.neutral200,
  //Text that is a standalone piece of text on a light background but also pressable causing some kind of event.
  textLightBgButton: palette.bluePressable,
  /**
   * The default text color in many components.
   */
  text: palette.neutral100,

  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.tableBorder,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,

  /**
   * The default color of the icons
   */
  icon: palette.primary500,

  /**
   * Dimmer Icon
   */
  dimIcon: palette.primary500,

  scannerInfoBox: "rgba(44, 62, 80, 0.5)",
}
