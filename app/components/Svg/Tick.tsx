import * as React from "react"
import Svg, { SvgProps, Path, Defs, Pattern, Use, Image } from "react-native-svg"
const Tick = (props: SvgProps) => (
  <Svg
    //@ts-ignore
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <Path fill="url(#a)" d="M0 0h50v50H0z" />
    <Defs>
      <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
        <Use xlinkHref="#b" transform="scale(.01042)" />
      </Pattern>
      <Image
        xlinkHref="data:image/png;base64,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"
        id="b"
        width={96}
        height={96}
      />
    </Defs>
  </Svg>
)
export default Tick
