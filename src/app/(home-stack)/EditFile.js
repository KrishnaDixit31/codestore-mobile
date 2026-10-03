import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { writeFile } from "../../store/fileStore";

const EditFile = () => {
  const { theme } = useTheme();
  const styles = style(theme);
  const { uri, fileName, fileType, initialContent } = useLocalSearchParams();
  const [codeSnippet, setCodeSnippet] = useState(initialContent);

  const handleBack = () => {
    if (!codeSnippet.trim()) {
      Alert.alert("Empty Input", "Please enter code before going back.");
      return;
    }

    router.back();
  };

  const handleSave = () => {
    if (!codeSnippet.trim()) {
      Alert.alert("Empty Input", "Please enter code before save.");
      return;
    }
    writeFile(uri, codeSnippet);
    setCodeSnippet("");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={handleBack}
          hitSlop={10}
          style={({ pressed }) => [
            styles.headerBack,
            pressed && { opacity: 0.6, transform: [{ scale: 0.9 }] },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>

        <View style={styles.titleContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>{fileType}</Text>
          </View>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {fileName + "." + fileType}
          </Text>
        </View>
      </View>

      <View style={styles.items}>
        <Text style={styles.title}>Write your code</Text>
        <TextInput
          multiline
          placeholder="Write your code here..."
          placeholderTextColor={theme.textSecondary}
          style={styles.codeInput}
          textAlignVertical="top"
          value={codeSnippet}
          onChangeText={setCodeSnippet}
          scrollEnabled
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}
        onPress={() => handleSave()}
      >
        <Ionicons
          name="save-outline"
          size={20}
          color="#fff"
          style={{ marginLeft: -12 }}
        />
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default EditFile;

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
      height: 68,
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerBack: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 6,
      marginLeft: -8,
    },
    items: {
      flex: 1,
      minHeight: 0,
      marginTop: 12,
      gap: 16,
      position: "relative",
    },
    title: {
      fontSize: 18,
      fontFamily: theme.fontBold,
      color: theme.text,
    },
    codeInput: {
      flex: 1,
      width: "100%",
      minHeight: 0,
      fontSize: 14,
      fontFamily: theme.fontSemiBold,
      padding: 16,
      color: theme.text,
      backgroundColor: theme.output,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: theme.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
      minWidth: 0,
    },
    logo: {
      width: 42,
      height: 32,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      marginTop: 4,
    },
    logoText: {
      fontSize: 18,
      fontWeight: "600",
      fontFamily: theme.fontSemiBold,
      color: "#fff",
      marginTop: -4,
    },
    cardTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      fontFamily: theme.fontSemiBold,
      color: theme.text,
    },
    button: {
      marginTop: 12,
      marginBottom: 8,
      height: 52,
      borderRadius: 14,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },
    buttonText: {
      fontSize: 15,
      color: "#fff",
      fontFamily: theme.fontBold,
    },
  });
