import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 280,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="(main-tabs)"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="DetailSnippet"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EditSnippet"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="FilePreview"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EditFile"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
