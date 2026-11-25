import ActivityCard from "@/components/ActivityCard";
import Header from "@/components/Header";
import StartRunButton from "@/components/StartRunButton";
import StatsCard from "@/components/StatsCard";
import type { Activity } from "@/types/Activity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const [miles, setMiles] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const isSavingRef = useRef(false);

  const value = `${miles} miles`;
  const detailValue = String(totalRuns);

  const handleStartRun = () => {
    router.push("/stopwatch");
  };

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  const handleCompleteRun = async () => {
    if (isSavingRef.current) {
      return;
    }

    try {
      isSavingRef.current = true;

      const newMiles = miles + 1;
      const newTotalRuns = totalRuns + 1;

      const newActivity: Activity = {
        id: String(Date.now()),
        type: "run",
        distanceMiles: 1,
        completedAt: new Date().toISOString(),
      };
      const newActivities = [...activities, newActivity];

      const updatedData = {
        miles: newMiles,
        totalRuns: newTotalRuns,
        activities: newActivities,
      };

      console.log("Updated User Data:", JSON.stringify(updatedData));

      await AsyncStorage.setItem("fyreUserData", JSON.stringify(updatedData));

      setMiles(newMiles);
      setTotalRuns(newTotalRuns);
      setActivities(newActivities);
      console.log("New Activity:", newActivity);
    } catch (error) {
      console.error("There was an error", error);
    } finally {
      isSavingRef.current = false;
    }
  };
  useFocusEffect(
    useCallback(() => {
      const loadUserInfo = async () => {
        try {
          let loadedNewData = false;
          const savedUserData = await AsyncStorage.getItem("fyreUserData");
          const savedMiles = await AsyncStorage.getItem("fyreMiles");
          const savedTotalRuns = await AsyncStorage.getItem("fyreTotalRuns");
          const savedActivities = await AsyncStorage.getItem("fyreActivities");

          console.log("Saved Miles:", savedMiles);
          console.log("Saved Total Runs:", savedTotalRuns);
          console.log("Saved Activities:", savedActivities);

          if (savedUserData !== null) {
            try {
              const parsedUserData = JSON.parse(savedUserData);
              if (
                parsedUserData !== null &&
                typeof parsedUserData === "object" &&
                !Array.isArray(parsedUserData)
              ) {
                const validMiles =
                  Number.isFinite(parsedUserData.miles) &&
                  parsedUserData.miles >= 0;
                const validTotalRuns =
                  Number.isFinite(parsedUserData.totalRuns) &&
                  Number.isInteger(parsedUserData.totalRuns) &&
                  parsedUserData.totalRuns >= 0;
                const validActivities = Array.isArray(
                  parsedUserData.activities,
                );

                if (validMiles && validTotalRuns && validActivities) {
                  setMiles(parsedUserData.miles);
                  setTotalRuns(parsedUserData.totalRuns);
                  setActivities(parsedUserData.activities);
                  loadedNewData = true;
                } else {
                  setLoadError(true);
                }
              } else {
                setLoadError(true);
              }
            } catch (error) {
              console.error("Invalid Saved User Data", error);
              setLoadError(true);
            }
          }
          if (!loadedNewData) {
            if (savedMiles !== null) {
              setMiles(Number(savedMiles));
            }
            if (savedTotalRuns !== null) {
              setTotalRuns(Number(savedTotalRuns));
            }
            if (savedActivities !== null) {
              try {
                const parsedActivities = JSON.parse(savedActivities);
                if (Array.isArray(parsedActivities)) {
                  setActivities(parsedActivities);
                  // console.log("Length of Array:", parsedActivities.length);
                }
              } catch (error) {
                console.error("Invalid legacy activity data:", error);
                setLoadError(true);
              }
            }
          }
        } catch (err) {
          console.error("An error has occured", err);
          setLoadError(true);
        } finally {
          setIsLoading(false);
        }
      };
      loadUserInfo();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Header onSettingsPress={handleSettingsPress} />
        <StatsCard
          title="All Time Distance"
          value={value}
          detailLabel="Completed Runs"
          detailValue={detailValue}
        />
        {!isLoading &&
          activities.length > 0 &&
          activities
            .slice(-3)
            .toReversed()
            .map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
        {!isLoading && !loadError && activities.length === 0 && (
          <Text>No Activities Yet, Your first run starts here!</Text>
        )}
      </ScrollView>

      {!isLoading && !loadError && <StartRunButton onPress={handleStartRun} />}
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
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    gap: 24,
    paddingBottom: 20,
  },
});
