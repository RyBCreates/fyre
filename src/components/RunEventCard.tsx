import type { RunEvent } from "@/types/RunEvent";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RunEventCardProps = {
  event: RunEvent;
  isJoined: boolean;
  onJoinPress: () => void;
};

export default function RunEventCard({
  event,
  isJoined,
  onJoinPress,
}: RunEventCardProps) {
  const startDate = new Date(event.startsAt);
  const formattedDate = startDate.toLocaleDateString();
  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const upperCaseDifficulty = event.difficulty.charAt(0).toUpperCase();
  const difficulty = upperCaseDifficulty + event.difficulty.slice(1);

  const badgeColor =
    event.difficulty === "beginner"
      ? "#DCFCE7"
      : event.difficulty === "intermediate"
        ? "#FEF3C7"
        : "#FEE2E2";

  const badgeTextColor =
    event.difficulty === "beginner"
      ? "#166534"
      : event.difficulty === "intermediate"
        ? "#92400E"
        : "#991B1B";

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          <View
            style={[styles.difficultyBadge, { backgroundColor: badgeColor }]}
          >
            <Text
              style={[styles.difficultyBadgeText, { color: badgeTextColor }]}
            >
              {difficulty}
            </Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#777777" />
            <Text>{event.startLocation}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#777777" />
            <Text>
              {formattedDate} @ {formattedTime}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="footsteps-outline" size={20} color="#777777" />
            <Text>{event.distanceMiles} miles</Text>
          </View>
        </View>
        <Pressable style={styles.joinButton} onPress={onJoinPress}>
          <Text style={styles.joinButtonText}>
            {isJoined ? "Leave Run" : "Join This Run"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "stretch",
    alignItems: "flex-start",
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 15,
    marginLeft: 15,
    marginRight: 15,
    gap: 10,
  },
  cardContent: {
    alignSelf: "stretch",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  difficultyBadge: {
    padding: 8,
    borderRadius: 25,
  },
  difficultyBadgeText: {
    fontSize: 16,
  },

  infoContainer: {
    gap: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  joinButton: {
    backgroundColor: "orange",
    width: "70%",
    alignSelf: "center",
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  joinButtonText: { fontSize: 24, alignSelf: "center" },
});
