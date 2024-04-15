import React, { ComponentType } from "react"
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { colors, spacing, typography } from "../theme"
import { Text, TextProps } from "./Text"
import * as Haptics from "expo-haptics"

type Presets = keyof typeof $viewPresets

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
  disabled?: boolean
}

export interface ButtonProps extends PressableProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override for background container that forms the button "edge" when not pressed. Use with caution, only indended for height and backgroundColor property adjustments.
   */
  raisedButtonEdgeStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "disabled" state.
   */
  disabledTextStyle?: StyleProp<TextStyle>
  /**
   * One of the different types of button presets.
   */
  preset?: Presets
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * Children components.
   */
  children?: React.ReactNode
  /**
   * disabled prop, accessed directly for declarative styling reasons.
   * https://reactnative.dev/docs/pressable#disabled
   */
  disabled?: boolean
  /**
   * An optional style override for the disabled state
   */
  disabledStyle?: StyleProp<ViewStyle>

  streak?: boolean

  streakColor?: string
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Button.md)
 */
export function Button(props: ButtonProps) {
  const {
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    raisedButtonEdgeStyle: $viewContainerStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    disabledTextStyle: $disabledTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    disabled,
    disabledStyle: $disabledViewStyleOverride,
    streak,
    streakColor,
    ...rest
  } = props

  const preset: Presets = props.preset ?? "default"
  function $viewStyle({ pressed }: PressableStateCallbackType) {
    return [
      $viewPresets[preset],
      $viewStyleOverride,
      !!pressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
      !!disabled && $disabledViewStyleOverride,
    ]
  }
  function $viewContainerStyle() {
    return [$viewContainerStylePresets[preset], $viewContainerStyleOverride]
  }
  function $textStyle({ pressed }: PressableStateCallbackType) {
    return [
      $textPresets[preset],
      $textStyleOverride,
      !!pressed && [$pressedTextPresets[preset], $pressedTextStyleOverride],
      !!disabled && $disabledTextStyleOverride,
    ]
  }

  const ButtonText = (state: any) => (
    <Text tx={tx} text={text} txOptions={txOptions} style={$textStyle(state)} />
  )

  const streakColorDefault = "#B3F858" as const

  return (
    <View style={$viewContainerStyle()}>
      <Pressable
        style={$viewStyle}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        {...rest}
        disabled={disabled}
        onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        {(state) => (
          <>
            {!!LeftAccessory && (
              <LeftAccessory
                style={$leftAccessoryStyle}
                pressableState={state}
                disabled={disabled}
              />
            )}
            {children ? children : ButtonText(state)}
            {streak && (
              <>
                <View
                  style={{
                    ...$streak,
                    backgroundColor: streakColor ? streakColor : streakColorDefault,
                  }}
                />
                <View
                  style={{
                    ...$streak2,
                    backgroundColor: streakColor ? streakColor : streakColorDefault,
                  }}
                />
              </>
            )}
            {!!RightAccessory && (
              <RightAccessory
                style={$rightAccessoryStyle}
                pressableState={state}
                disabled={disabled}
              />
            )}
          </>
        )}
      </Pressable>
    </View>
  )
}

const $baseViewStyle: ViewStyle = {
  minHeight: 40,
  borderRadius: 50,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  overflow: "hidden",
  marginTop: -4,
}

const $baseContainerViewStyle: ViewStyle = {
  minHeight: 40,
  borderRadius: 50,
}

const $baseTextStyle: TextStyle = {
  fontSize: 14,
  lineHeight: 20,
  fontFamily: typography.primary.medium,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 5,
}

const $rightAccessoryStyle: ViewStyle = { marginStart: spacing.xs, zIndex: 1 }
const $leftAccessoryStyle: ViewStyle = { marginEnd: spacing.xs, zIndex: 1 }

const $viewPresets = {
  defaultNoLift: [
    $baseViewStyle,
    {
      backgroundColor: colors.palette.neutral300,
    },
  ] as StyleProp<ViewStyle>,

  default: [
    $baseViewStyle,
    {
      backgroundColor: colors.palette.neutral300,
    },
  ] as StyleProp<ViewStyle>,

  filled: [$baseViewStyle, { backgroundColor: colors.palette.neutral300 }] as StyleProp<ViewStyle>,

  reversed: [
    $baseViewStyle,
    { backgroundColor: colors.palette.neutral200 },
  ] as StyleProp<ViewStyle>,
}

const $viewContainerStylePresets = {
  defaultNoLift: [] as StyleProp<ViewStyle>,

  default: [
    $baseContainerViewStyle,
    {
      // button raised side face color
      backgroundColor: "#2D4052",
    },
  ] as StyleProp<ViewStyle>,

  filled: [
    $baseContainerViewStyle,
    { backgroundColor: colors.palette.neutral300 },
  ] as StyleProp<ViewStyle>,

  reversed: [
    $baseContainerViewStyle,
    { backgroundColor: colors.palette.neutral200 },
  ] as StyleProp<ViewStyle>,
}

const $textPresets: Record<Presets, StyleProp<TextStyle>> = {
  defaultNoLift: $baseTextStyle,
  default: $baseTextStyle,
  filled: $baseTextStyle,
  reversed: [$baseTextStyle, { color: colors.palette.neutral100 }],
}

const $pressedViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  defaultNoLift: {},
  default: { marginTop: 0 },
  filled: { backgroundColor: colors.palette.neutral400 },
  reversed: { backgroundColor: colors.palette.secondary500 },
}

const $pressedTextPresets: Record<Presets, StyleProp<TextStyle>> = {
  defaultNoLift: { opacity: 0.9 },
  default: { opacity: 0.9 },
  filled: { opacity: 0.9 },
  reversed: { opacity: 0.9 },
}

const $streak: ViewStyle = {
  position: "absolute",
  height: 48,

  top: "90%",
  left: 0,
  right: 0,

  transform: [{ rotate: "-45deg" }, { scaleX: 4 }],
}
const $streak2: ViewStyle = {
  position: "absolute",
  height: 64,

  top: -64,
  left: 10,
  right: 0,
  transform: [{ rotate: "-45deg" }, { scaleX: 4 }],
}
