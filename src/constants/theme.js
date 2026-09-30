import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

export function useAppFonts() {
  return useFonts({
    JakartaRegular: PlusJakartaSans_400Regular,
    JakartaMedium: PlusJakartaSans_500Medium,
    JakartaSemiBold: PlusJakartaSans_600SemiBold,
    JakartaBold: PlusJakartaSans_700Bold,
  });
}

export const colors = {
  light: {
    background: "#FAF9F5",
    surface: "#FFFFFF",

    primary: "#527965",
    primaryLight: "#DCE8D9",

    text: "#172B35",
    textSecondary: "#657178",

    border: "#E5E4DE",

    Wave1: "#E5EDDF",
    Wave2: "#D5E2D3",

    output: "#F3F5EF",

    error: "#D45D5D",
    favorite: "#FFD700",

    fontRegular: "JakartaRegular",
    fontMedium: "JakartaMedium",
    fontSemiBold: "JakartaSemiBold",
    fontBold: "JakartaBold",
  },
  dark: {
    background: "#121716",
    surface: "#1C2421",

    primary: "#7FAE91",
    primaryLight: "#294238",

    text: "#F1F4F1",
    textSecondary: "#AAB5AF",

    border: "#303A35",

    Wave1: "#26332D",
    Wave2: "#1E2B26",

    output: "#202A26",

    error: "#DD7070",
    favorite: "#FFD700",

    fontRegular: "JakartaRegular",
    fontMedium: "JakartaMedium",
    fontSemiBold: "JakartaSemiBold",
    fontBold: "JakartaBold",
  },
};
