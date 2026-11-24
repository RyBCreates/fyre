import Header from "@/components/Header";
import StartRunButton from "@/components/StartRunButton";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Header />
      <StartRunButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF6B35",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
