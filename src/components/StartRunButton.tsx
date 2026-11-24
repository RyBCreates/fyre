import { Alert, Pressable, StyleSheet, Text } from "react-native";

export default function StartRunButton() {
  const handleStartRun = () => {
    Alert.alert("New Feature", "Run tracking coming soon!");
  };

  return (
    <Pressable style={styles.button} onPress={handleStartRun}>
      <Text style={styles.buttonText}>Start Run</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFF",
  },
  buttonText: {
    color: "#000000",
    fontSize: 28,
    fontWeight: "bold",
  },
});
