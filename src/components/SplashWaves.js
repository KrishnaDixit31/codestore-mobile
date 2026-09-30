import Svg, { Path } from "react-native-svg";
import { colors } from "../constants/theme";

const SplashWaves = ({ theme = colors.dark }) => {
  return (
    <Svg width="430" height="250" viewBox="0 0 430 250" fill="none">
      {/* Back / upper wave */}
      <Path
        d="
      M0 65
      C55 35 92 45 140 75
      C195 110 235 145 280 125
      C335 100 370 45 430 55
      L430 250
      L0 250
      Z
    "
        fill={theme.Wave1}
      />

      {/* Front / lower wave */}
      <Path
        d="
      M0 135
      C55 105 105 90 160 105
      C220 122 250 155 310 145
      C355 138 395 135 430 160
      L430 250
      L0 250
      Z
    "
        fill={theme.Wave2}
      />
    </Svg>
  );
};

export default SplashWaves;
