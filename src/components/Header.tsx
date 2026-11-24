import { StyleSheet, Text, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Fyre Friends</Text>
      <Text style={styles.subtitle}>Find Your Next Run</Text>
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
