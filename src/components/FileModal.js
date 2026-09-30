import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { router } from "expo-router";
import { createFile } from "../store/fileStore";

const fileTypes = ["txt", "md", "json", "js", "ts", "html", "css", "py"];

export default function CreateFileModal({ visible, onClose }) {
  const { theme } = useTheme();
  const styles = style(theme);

  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("js");

  const handleContinue = () => {
    if (!fileName.trim() || !fileType) {
      Alert.alert("Missing details", "Please fill all fields.");
      return;
    }
    const fileUri = createFile(fileName, fileType);
    setFileName("");
    setFileType("js");
    router.push({
      pathname: "/EditFile",
      params: { uri: fileUri, fileName, fileType },
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create File</Text>

            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          {/* File name */}
          <Text style={styles.label}>File Name</Text>
          <TextInput
            value={fileName}
            onChangeText={setFileName}
            placeholder="Enter file name"
            placeholderTextColor={theme.textSecondary}
            style={styles.input}
          />

          {/* File Type */}
          <Text style={styles.label}>Select File Type</Text>
          <View style={styles.typeContainer}>
            {fileTypes.map((type) => (
              <Pressable
                key={type}
                onPress={() => setFileType(type)}
                style={[
                  styles.typeChip,
                  fileType === type && styles.selectedTypeChip,
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    fileType === type && styles.selectedTypeText,
                  ]}
                >
                  {type.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Continue */}
          <Pressable style={styles.button} onPress={() => handleContinue()}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const style = (theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 30,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontFamily: theme.fontBold,
      color: theme.text,
    },
    label: {
      marginTop: 24,
      marginBottom: 8,
      fontSize: 16,
      fontFamily: theme.fontBold,
      color: theme.text,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      color: theme.text,
      fontSize: 15,
      fontFamily: theme.fontSemiBold,
    },
    typeContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 12,
    },
    typeChip: {
      minWidth: 58,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
    },
    selectedTypeChip: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    typeText: {
      color: theme.textSecondary,
      fontSize: 12,
      fontFamily: theme.fontSemiBold,
    },
    selectedTypeText: {
      color: "#fff",
    },
    button: {
      marginTop: 24,
      height: 52,
      borderRadius: 14,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: 15,
      color: "#fff",
      fontFamily: theme.fontBold,
    },
  });
