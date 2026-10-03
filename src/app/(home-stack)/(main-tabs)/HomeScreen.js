import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState, useMemo } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { getAllData, parseTags, toggleFavorite } from "../../../store/database";

const HomeScreen = () => {
  const { theme } = useTheme();
  const route = useRouter();
  const styles = style(theme);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const [snippets, setSnippets] = useState([]);

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
  const languages = [
    "All",
    "React",
    "ReactNative",
    "JavaScript",
    "TypeScript",
    "Python",
  ];

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

  const cards = (item) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}
        onPress={() =>
          route.push({
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
          <Ionicons
            name={search ? "search-outline" : "code-slash-outline"}
            size={34}
            color={theme.primary}
          />
        </View>
        <Text style={styles.emptyTitle}>
          {search || selectedLanguage !== "All"
            ? "No snippets found"
            : "Your library is empty"}
        </Text>
        <Text style={styles.emptyMessage}>
          {search || selectedLanguage !== "All"
            ? "Try another search or language filter."
            : "Save your favorite code snippets here for quick access."}
        </Text>
      </View>
    );
  };

  const filteredData = useMemo(() => {
    return snippets?.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesLanguage =
        selectedLanguage === "All" || item.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [snippets, search, selectedLanguage]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>CodeStore</Text>
      <View style={styles.rowContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search Snippets..."
            placeholderTextColor={theme.textSecondary}
            style={styles.inputText}
          />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.filterContainer,
            pressed && { opacity: 0.75, transform: [{ scale: 0.94 }] },
          ]}
          onPress={() => setShowDropdown((visible) => !visible)}
        >
          <Ionicons
            name="filter-circle-outline"
            size={24}
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
                  setSelectedLanguage(item);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.optionText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <View>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => cards(item)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 80,
          }}
          ListEmptyComponent={() => emptyComponent()}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const style = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: theme.background,
    },
    headerTitle: {
      color: theme.text,
      fontSize: 24,
      fontFamily: theme.fontBold,
      marginBottom: 4,
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 22,
    },
    searchContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      backgroundColor: theme.surface,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 2.22,
      elevation: 2,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inputText: {
      width: "100%",
      fontSize: 15,
      fontFamily: theme.fontSemiBold,
      color: theme.text,
      marginLeft: 6,
      marginRight: 20,
    },
    filterContainer: {
      marginLeft: 10,
      padding: 8,
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
    dropdown: {
      width: 250,
      position: "absolute",
      top: 50,
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
      paddingHorizontal: 28,
      paddingVertical: 48,
      marginTop: 12,
      backgroundColor: theme.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    emptyIcon: {
      width: 68,
      height: 68,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
      borderRadius: 34,
      backgroundColor: theme.primaryLight,
    },
    emptyTitle: {
      color: theme.text,
      fontSize: 18,
      fontFamily: theme.fontBold,
      textAlign: "center",
      marginBottom: 8,
    },
    emptyMessage: {
      color: theme.textSecondary,
      fontSize: 14,
      fontFamily: theme.fontSemiBold,
      lineHeight: 21,
      textAlign: "center",
    },
  });
