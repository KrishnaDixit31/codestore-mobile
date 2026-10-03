import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { insertData } from "../../../store/database";

const CreateScreen = () => {
  const { theme } = useTheme();
  const [language, setLanguage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");

  const languages = [
    "React",
    "ReactNative",
    "JavaScript",
    "TypeScript",
    "Python",
  ];

  const styles = style(theme);

  const handleSave = async () => {
    if ([title, language, tags, codeSnippet].some((value) => !value.trim())) {
      Alert.alert("Missing details", "Please fill all fields.");
      return;
    }

    await insertData(title, language, tags, codeSnippet);
    setTitle("");
    setLanguage("");
    setTags("");
    setCodeSnippet("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Create New Snippet</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.itemContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.items}>
            <Text style={styles.title}>Title</Text>
            <TextInput
              placeholder="Enter Snippet Title"
              placeholderTextColor={theme.textSecondary}
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.items}>
            <Text style={styles.title}>Language</Text>

            <Pressable
              style={({ pressed }) => [
                styles.input,
                pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] },
              ]}
              onPress={() => setShowDropdown((visible) => !visible)}
            >
              <Text
                style={[
                  styles.selectedLanguage,
                  {
                    color: language ? theme.text : theme.textSecondary,
                  },
                ]}
              >
                {language || "Select Language"}
              </Text>
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>

            {showDropdown && (
              <View style={styles.dropdown}>
                {languages.map((item) => (
                  <Pressable
                    key={item}
                    style={({ pressed }) => [
                      styles.option,
                      pressed && {
                        opacity: 0.7,
                        backgroundColor: theme.primaryLight,
                      },
                    ]}
                    onPress={() => {
                      setLanguage(item);
                      setShowDropdown(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.items}>
            <Text style={styles.title}>Tags (comma separated)</Text>
            <TextInput
              placeholder="e.g. react,hooks,javascript"
              placeholderTextColor={theme.textSecondary}
              style={styles.input}
              value={tags}
              onChangeText={setTags}
            />
          </View>

          <View style={styles.items}>
            <Text style={styles.title}>Code</Text>
            <TextInput
              multiline
              placeholder="Write your code here..."
              placeholderTextColor={theme.textSecondary}
              style={styles.codeInput}
              textAlignVertical="top"
              value={codeSnippet}
              onChangeText={setCodeSnippet}
            />
          </View>
        </ScrollView>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleSave}
        >
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.saveText}>Save Snippet</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateScreen;

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
    itemContainer: {
      gap: 14,
      paddingVertical: 18,
      paddingBottom: 40,
    },
    items: {
      gap: 8,
      position: "relative",
    },
    title: {
      fontSize: 16,
      fontFamily: theme.fontBold,
      color: theme.text,
    },
    input: {
      minHeight: 52,
      fontSize: 15,
      fontFamily: theme.fontSemiBold,
      fontWeight: "500",
      color: theme.text,
      paddingHorizontal: 12,
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dropdown: {
      position: "absolute",
      top: 90,
      left: 0,
      right: 0,
      zIndex: 10,
      elevation: 2,
      overflow: "hidden",
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    option: {
      minHeight: 48,
      paddingHorizontal: 14,
      justifyContent: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    optionText: {
      fontSize: 15,
      fontFamily: theme.fontSemiBold,
      color: theme.text,
    },
    selectedLanguage: {
      fontSize: 15,
      fontFamily: theme.fontSemiBold,
      fontWeight: "500",
    },
    codeInput: {
      width: "100%",
      minHeight: 200,
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
    saveButton: {
      height: 52,
      marginTop: 12,
      marginBottom: 12,
      borderRadius: 14,
      backgroundColor: theme.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    saveText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontFamily: theme.fontSemiBold,
    },
  });
