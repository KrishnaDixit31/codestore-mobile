import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAppFonts } from "../constants/theme";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { createTable } from "@/store/database";

function RootStack() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 250,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="SplashScreen" options={{ animation: "fade" }} />
      <Stack.Screen name="OnboardingScreen" options={{ animation: "fade" }} />
      <Stack.Screen name="(home-stack)" options={{ animation: "fade" }} />
    </Stack>
  );
}

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
      <RootStack />
    </ThemeProvider>
  );
}
