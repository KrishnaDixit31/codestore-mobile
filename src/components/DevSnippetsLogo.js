import Svg, { Rect, Path } from "react-native-svg";

const DevSnippetsLogo = () => {
  return (
    <Svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      {/* Rounded green logo background */}
      <Rect x="20" y="30" width="110" height="110" rx="28" fill="#DCE8D9" />

      {/* Left < symbol */}
      <Path
        d="M58 70L42 84L58 98"
        stroke="#172B35"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* / symbol */}
      <Path
        d="M87 57L73 108"
        stroke="#172B35"
        strokeWidth={7}
        strokeLinecap="round"
      />

      {/* Right > symbol */}
      <Path
        d="M101 70L117 84L101 98"
        stroke="#172B35"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Leaf */}
      <Path
        d="M105 35C111 20 126 14 141 15C140 30 132 42 116 47C111 48 106 45 105 35Z"
        fill="#6C967C"
      />

      {/* Leaf vein */}
      <Path
        d="M109 43C118 35 126 28 136 20"
        stroke="#547965"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default DevSnippetsLogo;
