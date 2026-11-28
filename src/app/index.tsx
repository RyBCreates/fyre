import ActivityCard from "@/components/ActivityCard";
import Header from "@/components/Header";
import RunEventCard from "@/components/RunEventCard";
import SearchBar from "@/components/SearchBar";
import StartRunButton from "@/components/StartRunButton";
import StatsCard from "@/components/StatsCard";
import { BASE_URL } from "@/config/api";
import type { Activity } from "@/types/Activity";
import type { RunEvent } from "@/types/RunEvent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const [runsNeedRefresh, setRunsNeedRefresh] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [hasMoreRuns, setHasMoreRuns] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [miles, setMiles] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [runevents, setRunEvents] = useState<RunEvent[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [pendingRunIds, setPendingRunIds] = useState<Set<string>>(new Set());

  const isSavingRef = useRef(false);
  const pendingJoinRequestsRef = useRef<Set<string>>(new Set());
  const isLoadingMoreRef = useRef(false);

  const value = `${miles} miles`;
  const detailValue = String(totalRuns);

  const handleToggleJoin = async (event: RunEvent) => {
    if (pendingJoinRequestsRef.current.has(event.id) || runsNeedRefresh) {
      return;
    }
    try {
      pendingJoinRequestsRef.current.add(event.id);
      setPendingRunIds((previous) => {
        const updated = new Set(previous);
        updated.add(event.id);
        return updated;
      });
      const method = event.isJoined ? "DELETE" : "POST";
      const response = await fetch(`${BASE_URL}/runs/${event.id}/join`, {
        method: method,
      });

      if (!response.ok) {
        throw new Error(`Failed to update attendance: ${response.status}`);
      }
      try {
        await fetchRuns();
      } catch (error) {
        setRunsNeedRefresh(true);
        console.error("Error fetching runs after update", error);
        Alert.alert("Network Error", "Would you like to try again?", [
          { text: "Cancel" },
          {
            text: "Retry",
            onPress: async () => {
              try {
                await fetchRuns();
              } catch (error) {
                setRunsNeedRefresh(true);
                console.error("Retry failed", error);

                Alert.alert(
                  "Still Unable to Refresh",
                  "Your attendance may have changed, but we couldn't retrieve the latest information. Please try again when your connection is restored.",
                );
              }
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating attendance", error);
      Alert.alert("An error has occurred", "Attendance not updated");
    } finally {
      pendingJoinRequestsRef.current.delete(event.id);
      setPendingRunIds((previous) => {
        const updated = new Set(previous);
        updated.delete(event.id);
        return updated;
      });
    }
  };

  const handleRefreshRuns = async () => {
    try {
      await fetchRuns();
    } catch (error) {
      console.error("Something went wrong with the refresh", error);
      Alert.alert(
        "Something went wrong",
        "Please check your connection and try again",
      );
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

  const fetchRuns = useCallback(async () => {
    const response = await fetch(`${BASE_URL}/runs`);

    if (!response.ok) {
      throw new Error(`Failed to fetch runs: ${response.status}`);
    }
    const fetchedRuns: unknown = await response.json();

    if (!Array.isArray(fetchedRuns)) {
      throw new Error("Expected an array of running events");
    }
    setRunEvents(fetchedRuns);
    setHasMoreRuns(fetchedRuns.length === 10);
    setRunsNeedRefresh(false);
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMoreRef.current || runsNeedRefresh || !hasMoreRuns) {
      return;
    }
    try {
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
      const offset = runevents.length;
      const response = await fetch(`${BASE_URL}/runs?offset=${offset}`);
      if (!response.ok) {
        throw new Error("Error Loading more Run Events");
      }
      const fetchedMoreRuns: unknown = await response.json();

      if (!Array.isArray(fetchedMoreRuns)) {
        throw new Error("Expected an array of running events");
      }

      setRunEvents((previous) => [...previous, ...fetchedMoreRuns]);
      setHasMoreRuns(fetchedMoreRuns.length === 10);
    } catch (error) {
      console.error("There was an error loading more", error);
    } finally {
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;
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

          try {
            await fetchRuns();
          } catch (error) {
            console.error("Failed to load run events", error);
            setRunsNeedRefresh(true);
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
    }, [fetchRuns]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Header onSettingsPress={handleSettingsPress} />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {runsNeedRefresh && (
          <View style={styles.refreshButtonContainer}>
            <Text style={styles.refreshButtonWarningTitle}>
              Unable to load running events
            </Text>
            <Text style={styles.refreshButtonWarningSubtitle}>
              {runevents.length === 0
                ? "Running Events aren't available right now."
                : "Some information may be outdated"}
            </Text>
            <Pressable style={styles.refreshButton} onPress={handleRefreshRuns}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </Pressable>
          </View>
        )}
        {!isLoading &&
          runevents.length > 0 &&
          runevents.map((event) => (
            <RunEventCard
              key={event.id}
              event={event}
              isJoined={event.isJoined}
              onJoinPress={() => handleToggleJoin(event)}
              isPending={pendingRunIds.has(event.id)}
              isRefreshRequired={runsNeedRefresh}
            />
          ))}
        {hasMoreRuns && !isLoading && !runsNeedRefresh && (
          <Pressable
            style={[styles.loadMoreButton, isLoadingMore && { opacity: 0.5 }]}
            onPress={handleLoadMore}
            disabled={isLoadingMore}
          >
            <Text>{isLoadingMore ? "Loading" : "Load More Runs"}</Text>
          </Pressable>
        )}
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
    paddingTop: 12,
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
  loadMoreButton: { backgroundColor: "#FFF", borderRadius: 25, padding: 20 },
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
  refreshButtonContainer: { alignItems: "center", gap: 10 },
  refreshButtonWarningTitle: { fontSize: 24, fontWeight: "bold" },
  refreshButtonWarningSubtitle: { fontSize: 18 },
  refreshButton: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    padding: 20,
    width: "90%",
  },
  refreshButtonText: {
    color: "#000000",
    fontSize: 28,
  },
});
