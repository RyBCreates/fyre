import { Pressable, StyleSheet, Text } from "react-native";

type StartRunButtonProps = {
  onPress: () => void;
};

export default function StartRunButton({ onPress }: StartRunButtonProps) {
  const handleStartRun = () => {
    onPress();
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
    borderRadius: 25,
    padding: 20,
  },
  buttonText: {
    color: "#000000",
    fontSize: 28,
    fontWeight: "bold",
  },
});
