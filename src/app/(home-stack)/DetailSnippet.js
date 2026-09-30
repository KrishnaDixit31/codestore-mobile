import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/context/ThemeContext";
import {
  deleteData,
  getSingleData,
  parseTags,
  toggleFavorite,
} from "../../store/database";

const languageStyle = {
  React: {
    shortName: "R",
    bgColor: "#61DAFB",
  },
  ReactNative: {
    shortName: "RN",
    bgColor: "#61DAFB",
  },
  JavaScript: {
    shortName: "JS",
    bgColor: "#F7DF1E",
  },
  TypeScript: {
    shortName: "TS",
    bgColor: "#3178C6",
  },
  Python: {
    shortName: "PY",
    bgColor: "#3776AB",
  },
};

const DetailSnippet = () => {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const styles = style(theme);

  const [snippetData, setSnippetData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSnippet = async () => {
    setLoading(true);
    setSnippetData(null);

    try {
      const data = await getSingleData(Number(id));
      setSnippetData(data ?? null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadSnippet();
    }, [id]),
  );

  const handleCopy = async () => {
    await Clipboard.setStringAsync(snippetData.codeSnippet);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDelete = async (id) => {
    await deleteData(id);
    router.back();
    loadSnippet();
  };

  const callFavorite = async (id, isFavorite) => {
    const nextFavorite = isFavorite ? 0 : 1;
    setSnippetData((current) =>
      current ? { ...current, isFavorite: nextFavorite } : current,
    );

    try {
      await toggleFavorite(id, nextFavorite);
    } catch (error) {
      setSnippetData((current) =>
        current ? { ...current, isFavorite } : current,
      );
      console.log("Favorite update error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.headerBack}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Snippet Details</Text>
      </View>

      {loading ? (
        <Text style={styles.statusText}>Loading snippet...</Text>
      ) : !snippetData ? (
        <Text style={styles.statusText}>Snippet not found.</Text>
      ) : (
        <>
          <View style={styles.detailsContent}>
            <View
              style={[
                styles.logo,
                {
                  backgroundColor:
                    languageStyle[snippetData?.language]?.bgColor ||
                    theme.primary,
                },
              ]}
            >
              <Text style={styles.logoText}>
                {languageStyle[snippetData?.language]?.shortName ||
                  snippetData?.language ||
                  "?"}
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.cardTitle}>{snippetData?.title}</Text>
            </View>
            <Pressable
              style={styles.starContainer}
              onPress={() =>
                snippetData &&
                callFavorite(snippetData.id, snippetData.isFavorite)
              }
            >
              <Ionicons
                name={snippetData?.isFavorite ? "star" : "star-outline"}
                size={28}
                color={
                  snippetData?.isFavorite ? theme.favorite : theme.textSecondary
                }
              />
            </Pressable>
          </View>

          <View style={styles.rowAlign}>
            {parseTags(snippetData.tags).map((tag, index) => (
              <View key={index} style={styles.tagContainer}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.output}>
            <Text style={styles.outputText}>{snippetData.codeSnippet}</Text>
            <Pressable onPress={handleCopy} hitSlop={8} style={styles.copyIcon}>
              <Ionicons
                name={copied ? "checkmark" : "copy-outline"}
                size={20}
                color={theme.primary}
              />
            </Pressable>
          </View>

          <View style={styles.card}>
            <Pressable
              style={styles.cardItems}
              onPress={() =>
                router.push({
                  pathname: "/EditSnippet",
                  params: { item: JSON.stringify(snippetData) },
                })
              }
            >
              <Ionicons name="pencil" size={26} color={theme.textSecondary} />
              <Text style={styles.itemTitle}>Edit Snippet</Text>
              <Ionicons
                name="chevron-forward"
                size={22}
                color={theme.textSecondary}
              />
            </Pressable>
            <View style={styles.divider}></View>
            <Pressable
              style={styles.cardItems}
              onPress={() => handleDelete(snippetData.id)}
            >
              <Ionicons name="trash" size={26} color={theme.error} />
              <Text style={styles.itemTitle}>Delete Snippet</Text>
              <Ionicons
                name="chevron-forward"
                size={22}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default DetailSnippet;

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
    headerTitle: {
      marginLeft: 8,
      fontFamily: theme.fontBold,
      fontSize: 20,
      color: theme.text,
    },
    statusText: {
      marginTop: 24,
      fontFamily: theme.fontSemiBold,
      fontSize: 16,
      color: theme.textSecondary,
    },
    detailsContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      marginTop: 8,
      marginBottom: 8,
      backgroundColor: theme.background,
    },
    logo: {
      width: 50,
      height: 50,
      backgroundColor: "#86e7fd",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
    },
    logoText: {
      fontSize: 18,
      fontWeight: "600",
      fontFamily: theme.fontSemiBold,
      color: "#000",
      marginTop: -4,
    },
    content: {
      flex: 1,
      marginHorizontal: 16,
      alignSelf: "flex-start",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      fontFamily: theme.fontSemiBold,
      color: theme.text,
      marginBottom: 8,
    },
    rowAlign: {
      flexDirection: "row",
      gap: 8,
    },
    tagContainer: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: theme.primaryLight,
      borderRadius: 14,
    },
    tagText: {
      marginTop: -3,
      fontWeight: "600",
      fontSize: 14,
      color: theme.textSecondary,
    },
    starContainer: {
      padding: 4,
      alignSelf: "flex-start",
    },
    output: {
      width: "100%",
      height: 200,
      padding: 16,
      marginVertical: 24,
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
    outputText: {
      color: theme.text,
    },
    copyIcon: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.border,
    },
    card: {
      paddingHorizontal: 12,
      marginBottom: 8,
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
