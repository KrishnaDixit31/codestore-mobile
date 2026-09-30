import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTheme } from "@/context/ThemeContext";

export default function RootLayout() {
  const { theme } = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.surface}
      tintColor={theme.primary}
      iconColor={theme.textSecondary}
      indicatorColor={theme.primaryLight}
      rippleColor={theme.primaryLight}
      labelStyle={{
        fontSize: 12,
        fontWeight: "700",
        fontFamily: theme.fontBold,
      }}
    >
      <NativeTabs.Trigger name="HomeScreen">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="FavoriteScreen">
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="heart.fill" md="favorite" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="CreateSnippet">
        <NativeTabs.Trigger.Label>Create</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="plus" md="add" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="FileManagerScreen">
        <NativeTabs.Trigger.Label>Files</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="folder.fill" md="folder_info" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="SettingScreen">
        <NativeTabs.Trigger.Label>Setting</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
