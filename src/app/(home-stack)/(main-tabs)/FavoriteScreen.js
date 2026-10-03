import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { getAllData, parseTags, toggleFavorite } from "../../../store/database";
import { Ionicons } from "@expo/vector-icons";

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

const FavoriteScreen = () => {
  const { theme } = useTheme();
  const styles = style(theme);
  const [snippets, setSnippets] = useState([]);

  const loadSnippets = async () => {
    const data = await getAllData();
    setSnippets(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadSnippets();
    }, []),
  );

  const callFavorite = (id, isFavorite) => {
    toggleFavorite(id, isFavorite ? 0 : 1);
    loadSnippets();
  };

  const filteredData = snippets.filter((item) => {
    const matchesFavorite = item.isFavorite === 1;

    return matchesFavorite;
  });

  const cards = (item) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}
        onPress={() =>
          router.push({
            pathname: "/DetailSnippet",
            params: {
              id: item.id.toString(),
            },
          })
        }
      >
        <View
          style={[
            styles.logo,
            {
              backgroundColor:
                languageStyle[item.language]?.bgColor || theme.primary,
            },
          ]}
        >
          <Text style={styles.logoText}>
            {languageStyle[item.language]?.shortName || item.language}
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.rowAlign}>
            {parseTags(item.tags).map((tag, index) => (
              <View key={index} style={styles.tagContainer}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.starContainer,
            pressed && { opacity: 0.6, transform: [{ scale: 1.2 }] },
          ]}
          onPress={() => callFavorite(item.id, item.isFavorite)}
        >
          <Ionicons
            name={item.isFavorite ? "star" : "star-outline"}
            size={20}
            color={item.isFavorite ? theme.favorite : theme.textSecondary}
          />
        </Pressable>
      </Pressable>
    );
  };

  const emptyComponent = () => {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Ionicons name="star-outline" size={34} color={theme.primary} />
        </View>
        <Text style={styles.emptyTitle}>No favorite snippets yet</Text>
        <Text style={styles.emptyMessage}>
          Save your favorite code snippets here for quick access.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      <View>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => cards(item)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 80,
            marginTop: 18,
          }}
          ListEmptyComponent={emptyComponent}
        />
      </View>
    </SafeAreaView>
  );
};

export default FavoriteScreen;

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
      flexWrap: "wrap",
      gap: 6,
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
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 80,
    },
    emptyIcon: {
      alignItems: "center",
      justifyContent: "center",
      width: 68,
      height: 68,
      marginBottom: 16,
      borderRadius: 34,
      backgroundColor: theme.primaryLight,
    },
    emptyTitle: {
      marginBottom: 8,
      fontFamily: theme.fontBold,
      fontSize: 18,
      color: theme.text,
      textAlign: "center",
    },
    emptyMessage: {
      fontFamily: theme.fontRegular,
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
  });
