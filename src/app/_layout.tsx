import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAppFonts } from "../constants/theme";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { createTable } from "@/store/database";

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();

  useEffect(() => {
    createTable();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 250,
        }}
      >
        <Stack.Screen name="SplashScreen" options={{ animation: "fade" }} />
        <Stack.Screen name="OnboardingScreen" options={{ animation: "fade" }} />
        <Stack.Screen name="(home-stack)" options={{ animation: "fade" }} />
      </Stack>
    </ThemeProvider>
  );
}
