import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { dropTable } from "../../../store/database";

const SettingScreen = () => {
  const { theme, isDark, setDarkMode } = useTheme();
  const styles = style(theme);

  const clearData = () => {
    Alert.alert("Clear All Data", "Are you sure you want to delete all data?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await dropTable();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [
            styles.cardItems,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => setDarkMode(!isDark)}
        >
          <Ionicons name="moon" size={26} color={theme.textSecondary} />
          <Text style={styles.itemTitle}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={setDarkMode}
            thumbColor={isDark ? theme.primary : theme.surface}
            trackColor={{
              false: theme.border,
              true: theme.primaryLight,
            }}
            ios_backgroundColor={theme.border}
          />
        </Pressable>
        <View style={styles.divider}></View>
        <Pressable
          style={({ pressed }) => [
            styles.cardItems,
            pressed && { opacity: 0.7, transform: [{ scale: 0.99 }] },
          ]}
        >
          <Ionicons name="color-palette" size={26} color={theme.error} />
          <Text style={styles.itemTitle}>Accent Color</Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={theme.textSecondary}
          />
        </Pressable>
        <View style={styles.divider}></View>
        <Pressable
          style={({ pressed }) => [
            styles.cardItems,
            pressed && { opacity: 0.7, transform: [{ scale: 0.99 }] },
          ]}
          onPress={clearData}
        >
          <Ionicons name="trash-outline" size={26} color={theme.error} />
          <Text style={styles.itemTitle}>Clear All Data</Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={theme.textSecondary}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;

const style = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: theme.background,
      marginTop: -24,
    },
    headerContainer: {
      height: 60,
      marginTop: 8,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontFamily: theme.fontBold,
      fontSize: 20,
      color: theme.text,
    },
    card: {
      paddingHorizontal: 12,
      marginTop: 16,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 2.22,
      elevation: 2,
    },
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.border,
    },
    cardItems: {
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
      paddingVertical: 16,
    },
    itemTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      fontFamily: theme.fontSemiBold,
      color: theme.text,
    },
  });
