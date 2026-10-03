import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { pickFile, readDir } from "../../../store/fileStore";
import CreateFileModal from "../../../components/FileModal";
import ImportModal from "../../../components/ImportModal";

const fileTypeStyle = {
  "text/plain": {
    shortName: "TXT",
    bgColor: "#64748B",
  },

  "text/markdown": {
    shortName: "MD",
    bgColor: "#0F766E",
  },

  "application/json": {
    shortName: "JSON",
    bgColor: "#F0DB4F",
  },

  "text/javascript": {
    shortName: "JS",
    bgColor: "#F7DF1E",
  },

  "application/javascript": {
    shortName: "JS",
    bgColor: "#F7DF1E",
  },

  "text/typescript": {
    shortName: "TS",
    bgColor: "#3178C6",
  },

  "text/html": {
    shortName: "HTML",
    bgColor: "#E34F26",
  },

  "text/css": {
    shortName: "CSS",
    bgColor: "#1572B6",
  },

  "text/x-python": {
    shortName: "PY",
    bgColor: "#3776AB",
  },

  "application/pdf": {
    shortName: "PDF",
    bgColor: "#fa6d6d",
  },

  "image/png": {
    shortName: "PNG",
    bgColor: "#8B5CF6",
  },

  "image/jpeg": {
    shortName: "JPG",
    bgColor: "#8B5CF6",
  },
};

const FileManagerScreen = () => {
  const { theme } = useTheme();
  const styles = style(theme);
  const [filesList, setFilesList] = useState([]);
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const loadSnippets = () => {
    const data = readDir();
    setFilesList(data);
  };
  useFocusEffect(
    useCallback(() => {
      loadSnippets();
    }, []),
  );

  const handleCreate = () => {
    setShowCreateFile(true);
  };

  const handlePickFile = async () => {
    const file = await pickFile();

    if (!file) return;

    setSelectedFile(file);
    setShowImport(true);
  };

  const closeImportModal = () => {
    setShowImport(false);
    setSelectedFile(null);
  };

  const handleImportSuccess = () => {
    loadSnippets();
    closeImportModal();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;

    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;

    return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  };

  const cards = (item) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}
        onPress={() =>
          router.push({
            pathname: "/FilePreview",
            params: { uri: item.uri, fileName: item.name },
          })
        }
      >
        <View
          style={[
            styles.logo,
            {
              backgroundColor:
                fileTypeStyle[item.type]?.bgColor || theme.primary,
            },
          ]}
        >
          <Text style={styles.logoText}>
            {fileTypeStyle[item.type]?.shortName || "FILE"}
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.cardTitle}>{item.name.split(".")[0]}</Text>
          <View style={styles.rowAlign}>
            <Text style={styles.smallText}> {formatFileSize(item.size)}</Text>
            <View style={styles.divider}></View>
            <Text style={styles.smallText}>
              {new Date(item.creationTime).toLocaleString()}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>File Manager</Text>
        <View style={styles.headerBtn}>
          <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.6, transform: [{ scale: 0.92 }] },
            ]}
            onPress={handleCreate}
            hitSlop={12}
          >
            <Ionicons
              name="add-circle-outline"
              size={28}
              color={theme.textSecondary}
            />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.6, transform: [{ scale: 0.92 }] },
            ]}
            onPress={handlePickFile}
            hitSlop={12}
          >
            <Ionicons name="download-outline" size={28} color={theme.primary} />
          </Pressable>
        </View>
      </View>

      <View>
        <FlatList
          data={filesList}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => cards(item)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
            marginTop: 18,
          }}
          ListEmptyComponent={<Text>No File Present</Text>}
        />
      </View>

      <CreateFileModal
        visible={showCreateFile}
        onClose={() => setShowCreateFile(false)}
      />

      <ImportModal
        visible={showImport}
        onClose={closeImportModal}
        selectedFile={selectedFile}
        onImportSuccess={handleImportSuccess}
      />
    </SafeAreaView>
  );
};

export default FileManagerScreen;

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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontFamily: theme.fontBold,
      fontSize: 20,
      color: theme.text,
    },
    headerBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    impText: {
      fontSize: 16,
      fontFamily: theme.fontBold,
      color: theme.primary,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      marginBottom: 18,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    logo: {
      width: 50,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
    },
    logoText: {
      fontSize: 14,
      fontWeight: "600",
      fontFamily: theme.fontSemiBold,
      color: "#fff",
      marginTop: -4,
    },
    content: {
      flex: 1,
      marginHorizontal: 16,
    },
    cardTitle: {
      fontSize: 19,
      fontWeight: "600",
      fontFamily: theme.fontSemiBold,
      color: theme.text,
      marginBottom: 8,
    },
    rowAlign: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    smallText: {
      fontSize: 12,
      fontFamily: theme.fontSemiBold,
      color: theme.textSecondary,
    },
    divider: {
      width: 1.4,
      height: "80%",
      alignSelf: "center",
      backgroundColor: theme.textSecondary,
    },
  });
