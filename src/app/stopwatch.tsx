import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Activity } from "@/types/Activity";

export default function StopWatch() {
  const router = useRouter();

  const [elapsedMilliseconds, setElapsedMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const hundredths = Math.floor((elapsedMilliseconds % 1000) / 10);
  const seconds = Math.floor((elapsedMilliseconds / 1000) % 60);
  const minutes = Math.floor((elapsedMilliseconds / 60000) % 60);
  const hours = Math.floor((elapsedMilliseconds / 3600000) % 24);
  const days = Math.floor(elapsedMilliseconds / 86400000);

  const formattedHundredths = String(hundredths).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedHours = String(hours).padStart(2, "0");

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const interval = setInterval(() => {
      if (startTimeRef.current !== null) {
        setElapsedMilliseconds(Date.now() - startTimeRef.current);
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  const handleToggle = () => {
    if (isRunning) {
      if (startTimeRef.current !== null) {
        setElapsedMilliseconds(Date.now() - startTimeRef.current);
      }
      setIsRunning(false);
    } else {
      startTimeRef.current = Date.now() - elapsedMilliseconds;
      setIsRunning(true);
    }
  };

  const handleFinishRun = () => {
    let finalDuration = elapsedMilliseconds;

    if (isRunning && startTimeRef.current !== null) {
      finalDuration = Date.now() - startTimeRef.current;
    }
    setElapsedMilliseconds(finalDuration);
    setIsRunning(false);

    Alert.alert("Finish Run?", "Do you want to finish this run?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Finish",
        onPress: async () => {
          const finishedActivity: Activity = {
            id: String(Date.now()),
            type: "run",
            distanceMiles: 0,
            completedAt: new Date().toISOString(),
            durationMilliseconds: finalDuration,
          };
          console.log("Finished Activity!", finishedActivity);

          try {
            let userData;
            const savedUserData = await AsyncStorage.getItem("fyreUserData");
            if (savedUserData === null) {
              userData = {
                miles: 0,
                totalRuns: 0,
                activities: [],
              };
            } else {
              userData = JSON.parse(savedUserData);
            }
            const updatedData = {
              ...userData,
              totalRuns: userData.totalRuns + 1,
              activities: [...userData.activities, finishedActivity],
            };
            await AsyncStorage.setItem(
              "fyreUserData",
              JSON.stringify(updatedData),
            );

            router.back();
          } catch (error) {
            console.error("There was an error saving this activity", error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Run in Progress</Text>
      <View style={styles.timer}>
        {days > 0 && <Text style={styles.timerDays}>{days}d</Text>}
        <Text style={styles.timerHours}>
          {formattedHours}:{formattedMinutes}:{formattedSeconds}.
          {formattedHundredths}
        </Text>
      </View>
      <Pressable style={styles.pauseButton} onPress={handleToggle}>
        <Text style={styles.pauseButtonText}>
          {isRunning
            ? "Pause"
            : elapsedMilliseconds === 0
              ? "Start Run"
              : "Resume"}
        </Text>
      </Pressable>
      <Pressable style={styles.finishButton} onPress={handleFinishRun}>
        <Text style={styles.finishButtonText}>Finish Run</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF6B35",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    gap: 24,
  },
  title: { fontSize: 24 },
  timer: { flexDirection: "row", gap: 12, alignItems: "center" },
  timerDays: { fontSize: 60, color: "#FFF" },
  timerHours: { fontSize: 60, color: "#FFF" },
  pauseButton: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
  },
  pauseButtonText: {
    fontSize: 30,
  },
  finishButton: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
  },
  finishButtonText: {
    fontSize: 30,
  },
});
