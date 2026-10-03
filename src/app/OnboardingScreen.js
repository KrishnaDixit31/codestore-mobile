import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";

const onboardingScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = style(theme);

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("onboardingCompleted", "true");
    router.replace("/HomeScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <Image
          source={require("../../assets/images/onboarding.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Your Code Companion</Text>

      <Text style={styles.subtitle}>
        Save code snippets, manage files, and build your offline developer
        knowledge vault. Everything stays on your device.
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.btnStyle,
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}
        onPress={handleGetStarted}
      >
        <View style={styles.btnContent}>
          <Text style={styles.btnText}>Get Started</Text>
          <Ionicons
            name="arrow-forward"
            size={22}
            color="#fff"
            style={styles.iconStyle}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default onboardingScreen;

const style = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: "center",
    },
    illustration: {
      width: "100%",
      height: "62%",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      fontFamily: theme.fontSemiBold,
      marginTop: -62,
      color: theme.text,
    },
    subtitle: {
      maxWidth: 310,
      fontSize: 15,
      lineHeight: 23,
      textAlign: "center",
      color: theme.textSecondary,
      paddingHorizontal: 35,
      marginTop: 12,
    },
    btnStyle: {
      width: "76%",
      marginTop: 120,
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 32,
      backgroundColor: theme.primary,
    },
    btnContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    btnText: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "600",
      fontFamily: theme.fontSemiBold,
      color: "#fff",
    },
    iconStyle: {
      marginLeft: 12,
      alignSelf: "center",
    },
  });
