import { BASE_URL } from "@/config/api";
import type { RunEvent } from "@/types/RunEvent";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HostRun() {
  const router = useRouter();

  const [runTitle, setRunTitle] = useState("");
  const [runStartLocation, setRunStartLocation] = useState("");
  const [runDistance, setRunDistance] = useState("");
  const [runDifficulty, setRunDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");
  const [runStartsAt, setRunStartsAt] = useState(new Date());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleSubmitForm = async () => {
    if (isSubmittingRef.current) {
      return;
    }
    const distance = Number(runDistance);
    if (runTitle.trim() === "") {
      Alert.alert("Missing Title", "Please enter a run title.");
      return;
    }

    if (runStartLocation.trim() === "") {
      Alert.alert("Missing Location", "Please enter a meeting location.");
      return;
    }

    if (distance <= 0 || !Number.isFinite(distance)) {
      Alert.alert("Invalid Distance", "Value must be greater than 0");
      return;
    }

    if (runStartsAt.getTime() <= Date.now()) {
      Alert.alert(
        "Invalid Start Date/Time",
        "Start Time must be in the future",
      );
      return;
    }

    const newRunEvent: Omit<RunEvent, "id"> = {
      title: runTitle.trim(),
      startLocation: runStartLocation.trim(),
      distanceMiles: distance,
      difficulty: runDifficulty,
      startsAt: runStartsAt.toISOString(),
    };

    try {
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      const response = await fetch(`${BASE_URL}/runs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRunEvent),
      });
      if (!response.ok) {
        throw new Error(`Failed to save event: ${response.status}`);
      }
      router.back();
    } catch (error) {
      Alert.alert("Request Failed", "Something went wrong");
      console.error("There was an issue saving the event", error);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Create Your Run</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Name Your Run..."
            placeholderTextColor="#666666"
            value={runTitle}
            onChangeText={setRunTitle}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#666666"
            value={runStartLocation}
            onChangeText={setRunStartLocation}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Distance</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="Distance"
            placeholderTextColor="#666666"
            value={runDistance}
            onChangeText={setRunDistance}
          />
        </View>
        <Text style={styles.inputLabel}>Choose Difficulty:</Text>
        <View style={styles.difficultySelector}>
          <Pressable
            style={[
              styles.difficultyButton,
              {
                backgroundColor: "#DCFCE7",
                borderColor:
                  runDifficulty === "beginner" ? "#166534" : "transparent",
              },
            ]}
            onPress={() => {
              setRunDifficulty("beginner");
            }}
          >
            <Text style={styles.difficultyButtonText}>Beginner</Text>
          </Pressable>
          <Pressable
            style={[
              styles.difficultyButton,
              {
                backgroundColor: "#FEF3C7",
                borderColor:
                  runDifficulty === "intermediate" ? "#92400E" : "transparent",
              },
            ]}
            onPress={() => {
              setRunDifficulty("intermediate");
            }}
          >
            <Text style={styles.difficultyButtonText}>Intermediate</Text>
          </Pressable>
          <Pressable
            style={[
              styles.difficultyButton,
              {
                backgroundColor: "#FEE2E2",
                borderColor:
                  runDifficulty === "advanced" ? "#991B1B" : "transparent",
              },
            ]}
            onPress={() => {
              setRunDifficulty("advanced");
            }}
          >
            <Text style={styles.difficultyButtonText}>Advanced</Text>
          </Pressable>
        </View>
        <Text style={styles.inputLabel}>Select A Date and Time:</Text>
        <View style={styles.dateTimeSelector}>
          <DateTimePicker
            value={runStartsAt}
            mode="date"
            onValueChange={(_, selectedDate) => {
              setRunStartsAt(selectedDate);
            }}
          ></DateTimePicker>
          <DateTimePicker
            value={runStartsAt}
            mode="time"
            onValueChange={(_, selectedTime) => {
              setRunStartsAt(selectedTime);
            }}
          ></DateTimePicker>
        </View>
        <Pressable
          style={styles.submitButton}
          onPress={handleSubmitForm}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Creating" : "Create Event"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF6B35",
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 24,
    paddingBottom: 20,
    alignItems: "center",
  },

  title: { fontSize: 30, fontWeight: "bold" },
  inputContainer: {
    width: "90%",
    gap: 6,
  },
  inputLabel: { fontSize: 16, fontWeight: "bold" },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 48,
    width: "100%",
  },
  difficultySelector: {
    flexDirection: "row",
    gap: 20,
  },
  difficultyButton: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  difficultyButtonText: {
    fontSize: 16,
  },
  dateTimeSelector: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
  },
  submitButtonText: {
    fontSize: 30,
  },
});
