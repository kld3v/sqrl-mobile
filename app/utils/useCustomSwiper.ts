import { PanGestureHandler, GestureEvent, State } from "react-native-gesture-handler"

interface SwipeOptions {
  onSwipeRight?: () => void
  onSwipeLeft?: () => void
}

export default (options: SwipeOptions = {}) => {
  const { onSwipeRight, onSwipeLeft } = options
  const swipeThreshold = 60 // Minimum pixels the user must swipe to trigger the action
  const velocityThreshold = 500 // Minimum velocity of the swipe

  const onSwipeEvent = (event: GestureEvent<Record<string, number>>) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent

      if (Math.abs(translationX) > swipeThreshold && Math.abs(velocityX) > velocityThreshold) {
        if (translationX > 0) {
          console.log("Swiped right")
          onSwipeRight && onSwipeRight()
        } else {
          console.log("Swiped left")
          onSwipeLeft && onSwipeLeft()
        }
      }
    }
  }

  return { onSwipeEvent }
}
