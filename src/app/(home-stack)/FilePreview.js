import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import {
  deleteFile,
  openPdf,
  readFile,
  shareFile,
} from "../../store/fileStore";

const FilePreview = () => {
  const { theme } = useTheme();
  const styles = style(theme);
  const { uri, fileName } = useLocalSearchParams();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const extension =
    typeof fileName === "string"
      ? fileName.split(".").pop()?.toLowerCase()
      : "";

  const isImage =
    extension === "png" || extension === "jpg" || extension === "jpeg";

  const isPdf = extension === "pdf";

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadContent = async () => {
        if (typeof uri !== "string") {
          setError("File location is missing.");
          return;
        }

        if (isImage || isPdf) {
          return;
        }

        try {
          const fileContent = await readFile(uri);
          if (isActive) {
            setContent(fileContent);
            setError("");
          }
        } catch {
          if (isActive) setError("Unable to load this file.");
        }
      };

      loadContent();
      return () => {
        isActive = false;
      };
    }, [uri, isImage, isPdf]),
  );

  const handlePdf = async () => {
    if (typeof uri !== "string") return;

    await openPdf(uri);
  };

  const handleShare = async () => {
    if (typeof uri !== "string") return;

    await shareFile(uri);
  };

  const handleDelete = () => {
    if (typeof uri !== "string") return;

    Alert.alert("Delete File", "Are you sure you want to delete this file?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteFile(uri);
          router.replace("/(home-stack)/(main-tabs)/FileManagerScreen");
        },
      },
    ]);
  };

  const handleEdit = () => {
    if (typeof uri !== "string") return;

    const currentFileName = typeof fileName === "string" ? fileName : "";
    const extensionIndex = currentFileName.lastIndexOf(".");
    const fileType =
      extensionIndex > 0 ? currentFileName.slice(extensionIndex + 1) : "";
    const editableName =
      extensionIndex > 0
        ? currentFileName.slice(0, extensionIndex)
        : currentFileName;

    router.push({
      pathname: "/EditFile",
      params: {
        uri,
        fileName: editableName,
        fileType,
        initialContent: content,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={({ pressed }) => [
            styles.back,
            pressed && { opacity: 0.6, transform: [{ scale: 0.9 }] },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>
          {typeof fileName === "string" ? fileName : "File Preview"}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.preview}
        showsVerticalScrollIndicator={false}
      >
        {isImage ? (
          <Image
            source={{ uri }}
            style={styles.imagePreview}
            resizeMode="contain"
          />
        ) : isPdf ? (
          <Pressable
            onPress={() => handlePdf()}
            style={({ pressed }) => [
              styles.pdfPlaceholder,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Ionicons
              name="document-text-outline"
              size={64}
              color={theme.primary}
            />

            <Text style={styles.pdfText}>Open PDF</Text>
          </Pressable>
        ) : (
          <Text selectable style={styles.content}>
            {error || content || "This file is empty."}
          </Text>
        )}
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete file"
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.actionButton,
            styles.deleteButton,
            pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
          ]}
        >
          <Ionicons name="trash-outline" size={20} color={theme.error} />
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share file"
          onPress={handleShare}
          style={({ pressed }) => [
            styles.actionButton,
            styles.shareButton,
            pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
          ]}
        >
          <Ionicons name="share-outline" size={20} color={theme.text} />
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
        {!isImage && !isPdf && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit file"
            onPress={handleEdit}
            style={({ pressed }) => [
              styles.actionButton,
              styles.editButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
            ]}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FilePreview;

const style = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: theme.background,
      marginTop: -24,
    },
    header: {
      minHeight: 68,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    back: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: -8,
      marginTop: 6,
      marginRight: 8,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontFamily: theme.fontBold,
      color: theme.text,
    },
    scrollView: {
      flex: 1,
      marginTop: 14,
      marginBottom: 18,
    },
    preview: {
      flex: 1,
      padding: 16,
      paddingBottom: 24,
      backgroundColor: theme.output,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
    },
    imagePreview: {
      width: "100%",
      height: 500,
    },
    pdfPlaceholder: {
      flex: 1,
      minHeight: 400,
      alignItems: "center",
      justifyContent: "center",
    },

    pdfText: {
      marginTop: 16,
      fontSize: 18,
      fontFamily: theme.fontBold,
      color: theme.text,
    },
    actions: {
      flexDirection: "row",
      gap: 8,
      paddingTop: 12,
      paddingBottom: 8,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    actionButton: {
      flex: 1,
      height: 62,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      borderRadius: 12,
    },
    deleteButton: {
      borderWidth: 1,
      borderColor: theme.error,
    },
    editButton: {
      backgroundColor: theme.primary,
    },
    shareButton: {
      borderWidth: 1,
      borderColor: theme.border,
    },
    deleteText: {
      fontSize: 11,
      fontFamily: theme.fontSemiBold,
      color: theme.error,
    },
    editText: {
      fontSize: 11,
      fontFamily: theme.fontSemiBold,
      color: "#fff",
    },
    shareText: {
      fontSize: 11,
      fontFamily: theme.fontSemiBold,
      color: theme.text,
    },
    content: {
      fontSize: 14,
      lineHeight: 21,
      fontFamily: theme.fontSemiBold,
      color: theme.text,
    },
  });
