import AsyncStorage from "@react-native-async-storage/async-storage";

const getTheme = async () => {
  const value = await AsyncStorage.getItem("appTheme");
  if (value === null) return null;

  try {
    const theme = JSON.parse(value);
    return typeof theme === "boolean" ? theme : null;
  } catch {
    return null;
  }
};

export const saveTheme = async (isDark) => {
  await AsyncStorage.setItem("appTheme", JSON.stringify(isDark));
};

export default getTheme;
