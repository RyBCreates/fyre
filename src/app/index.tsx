import Header from "@/components/Header";
import StartRunButton from "@/components/StartRunButton";
import WeeklyStatsCard from "@/components/WeeklyStatsCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [miles, setMiles] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);

  const handleCompleteRun = async () => {
    const newMiles = miles + 1;
    const newTotalRuns = totalRuns + 1;

    setMiles(newMiles);
    setTotalRuns(newTotalRuns);

    await AsyncStorage.setItem("fyreMiles", String(newMiles));
    await AsyncStorage.setItem("fyreTotalRuns", String(newTotalRuns));
  };

  useEffect(() => {
    const loadUserInfo = async () => {
      const savedMiles = await AsyncStorage.getItem("fyreMiles");
      const savedTotalRuns = await AsyncStorage.getItem("fyreTotalRuns");
      console.log("Saved Miles:", savedMiles);
      console.log("Saved Total Runs:", savedTotalRuns);
      if (savedMiles !== null) {
        setMiles(Number(savedMiles));
      }
      if (savedTotalRuns !== null) {
        setTotalRuns(Number(savedTotalRuns));
      }
    };
    loadUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <WeeklyStatsCard miles={miles} totalRuns={totalRuns} />
      <StartRunButton onPress={handleCompleteRun} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF6B35",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 16,
    gap: 24,
  },
});
