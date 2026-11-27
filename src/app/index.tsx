import ActivityCard from "@/components/ActivityCard";
import Header from "@/components/Header";
import RunEventCard from "@/components/RunEventCard";
import SearchBar from "@/components/SearchBar";
import StartRunButton from "@/components/StartRunButton";
import StatsCard from "@/components/StatsCard";
import type { Activity } from "@/types/Activity";
import type { RunEvent } from "@/types/RunEvent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const [miles, setMiles] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [runevents, setRunEvents] = useState<RunEvent[]>([]);

  const [joinedEventIds, setJoinedEventIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const isSavingRef = useRef(false);

  const value = `${miles} miles`;
  const detailValue = String(totalRuns);

  const handleToggleJoin = async (eventId: string) => {
    try {
      let updatedEventIds: string[];
      if (joinedEventIds.includes(eventId)) {
        updatedEventIds = joinedEventIds.filter((id) => id !== eventId);
      } else {
        updatedEventIds = [...joinedEventIds, eventId];
      }

      await AsyncStorage.setItem(
        "fyreJoinedEventIds",
        JSON.stringify(updatedEventIds),
      );
      setJoinedEventIds(updatedEventIds);
    } catch (error) {
      console.error("An error occured updating the joined Events", error);
    }
  };

  const handleStartRun = () => {
    router.push("/stopwatch");
  };

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  const handleHostRunPress = () => {
    router.push("/host-run");
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
          const savedRunEvents = await AsyncStorage.getItem("fyreRunEvents");
          const savedJoinedEventIds =
            await AsyncStorage.getItem("fyreJoinedEventIds");

          if (savedJoinedEventIds !== null) {
            try {
              const parsedJoinedEventIds = savedJoinedEventIds
                ? JSON.parse(savedJoinedEventIds)
                : [];
              const existingJoinedEventIds = Array.isArray(parsedJoinedEventIds)
                ? parsedJoinedEventIds
                : [];
              setJoinedEventIds(existingJoinedEventIds);
            } catch (error) {
              console.error(
                "There was an error loading your joined events",
                error,
              );
              setJoinedEventIds([]);
              setLoadError(true);
            }
          }

          if (savedRunEvents !== null) {
            try {
              const parsedEvents = savedRunEvents
                ? JSON.parse(savedRunEvents)
                : [];
              const existingEvents: RunEvent[] = Array.isArray(parsedEvents)
                ? parsedEvents
                : [];
              setRunEvents(existingEvents);
            } catch (error) {
              console.error("Invalid Saved Events", error);
              setRunEvents([]);
              setLoadError(true);
            }
          }

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
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {!isLoading &&
          runevents.length > 0 &&
          runevents.map((event) => (
            <RunEventCard
              key={event.id}
              event={event}
              isJoined={joinedEventIds.includes(event.id)}
              onJoinPress={() => handleToggleJoin(event.id)}
            />
          ))}
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
          <Text style={styles.noActivities}>
            No Activities Yet, Your first run will show up here!
          </Text>
        )}
      </ScrollView>

      {!isLoading && !loadError && (
        <View style={styles.buttonContainer}>
          <StartRunButton onPress={handleStartRun} />
          <Pressable style={styles.hostButton} onPress={handleHostRunPress}>
            <Text style={styles.hostButtonText}>Host a Run</Text>
          </Pressable>
        </View>
      )}
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
  },
  scrollContent: {
    gap: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  noActivities: {
    paddingHorizontal: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  hostButton: { backgroundColor: "#FFF", borderRadius: 25, padding: 20 },
  hostButtonText: {
    color: "#000000",
    fontSize: 28,
    fontWeight: "bold",
  },
});
