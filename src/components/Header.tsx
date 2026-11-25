import { Pressable, StyleSheet, Text, View } from "react-native";

type HeaderProps = {
  onSettingsPress: () => void;
};

export default function Header({ onSettingsPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Fyre Friends</Text>
      <Text style={styles.subtitle}>Find Your Next Run</Text>
      <Pressable onPress={onSettingsPress}>
        <Text>Settings</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
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
});
