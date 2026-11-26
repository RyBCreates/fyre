import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type HeaderProps = {
  onSettingsPress: () => void;
};

export default function Header({ onSettingsPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <View style={styles.logo}>
          <Image
            source={require("../../assets/images/flame-logo.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.title}>Fyre</Text>
        </View>
        <Pressable onPress={onSettingsPress} style={styles.profileButton}>
          <Text style={styles.settingsText}>Profile</Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>Find Your Next Run</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  menu: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 12,
  },
  profileButton: {
    justifyContent: "center",
  },
  settingsText: { fontSize: 16 },
});
