import * as React from "react"
import Svg, { SvgProps, Path, Defs, Pattern, Use, Image } from "react-native-svg"
const Cancel = (props: SvgProps) => (
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
export default Cancel
