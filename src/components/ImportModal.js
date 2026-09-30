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
import { copyImportedFile } from "../store/fileStore";

export default function ImportModal({
  visible,
  onClose,
  selectedFile,
  onImportSuccess,
}) {
  const { theme } = useTheme();
  const styles = style(theme);

  const [fileName, setFileName] = useState("");

  const handleImport = async () => {
    if (!selectedFile || !fileName.trim()) {
      Alert.alert("Missing details", "Please fill all fields.");
      return;
    }

    const extension = selectedFile.name?.split(".").pop()?.toLowerCase();
    const finalName = `${fileName.trim()}.${extension}`;

    const copiedFile = await copyImportedFile(selectedFile, finalName);

    if (copiedFile) {
      onImportSuccess?.(copiedFile);
    }

    setFileName("");
    onClose?.();
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
            <Text style={styles.title}>Import File</Text>

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

          {/* Continue */}
          <Pressable style={styles.button} onPress={() => handleImport()}>
            <Text style={styles.buttonText}>Import</Text>
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
