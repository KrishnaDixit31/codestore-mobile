import { StyleSheet, Text, View } from "react-native";
import DevSnippetsLogo from "../components/DevSnippetsLogo";
import SplashWaves from "../components/SplashWaves";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const SplashScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = style(theme);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let active = true;
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      setProgress(Math.min(((Date.now() - startTime) / 2000) * 100, 100));
    }, 16);

    const startApp = async () => {
      // Wait for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      if (!active) return;
      setProgress(100);

      // Check whether onboarding was completed
      const completed = await AsyncStorage.getItem("onboardingCompleted");
      if (!active) return;

      if (completed === "true") {
        // Returning user
        router.replace("/HomeScreen");
      } else {
        // First-time user
        router.replace("/OnboardingScreen");
      }
    };

    startApp();

    return () => {
      active = false;
      clearInterval(progressInterval);
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <DevSnippetsLogo />
      </View>
      <Text style={styles.text}>
        Code<Text style={{ color: theme.primary }}>Store</Text>
      </Text>
      <Text style={styles.subtext}>Offline Developer Knowledge Vault</Text>
      <View style={styles.bottomWaves}>
        <SplashWaves theme={theme} />
      </View>
      <View style={styles.progressBackground}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

export default SplashScreen;

const style = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: theme.background,
    },
    logoContainer: {
      width: "auto",
      height: "auto",
      marginTop: 200,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 48,
      marginTop: -12,
      fontWeight: "bold",
      fontFamily: theme.fontBold,
      color: theme.text,
    },
    subtext: {
      fontSize: 15,
      marginTop: 4,
      fontFamily: theme.fontSemiBold,
      color: theme.textSecondary,
    },
    bottomWaves: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 250,
    },
    progressBackground: {
      position: "absolute",
      bottom: 60,
      alignSelf: "center",
      width: 160,
      height: 4,
      borderRadius: 10,
      backgroundColor: "#C7D3CA",
    },
    progress: {
      height: 4,
      borderRadius: 10,
      backgroundColor: "#527965",
    },
  });
