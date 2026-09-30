import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { colors } from "../constants/theme";
import getTheme, { saveTheme } from "../store/asyncStore";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeOverride, setThemeOverride] = useState(null);

  useEffect(() => {
    let isActive = true;

    getTheme()
      .then((storedTheme) => {
        if (isActive) setThemeOverride(storedTheme);
      })
      .catch(() => {
        if (isActive) setThemeOverride(null);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const isDark = themeOverride ?? systemColorScheme === "dark";
  const theme = isDark ? colors.dark : colors.light;

  const setDarkMode = async (nextIsDark) => {
    setThemeOverride(nextIsDark);
    await saveTheme(nextIsDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }

  return context;
};
