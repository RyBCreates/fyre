import type { Activity } from "@/types/Activity";
import { StyleSheet, Text, View } from "react-native";

type ActivityCardProps = {
  activity: Activity;
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  const formattedDate = new Date(activity.completedAt).toLocaleDateString();
  const upperCaseActivity = activity.type.charAt(0).toUpperCase();
  const activityType = upperCaseActivity + activity.type.slice(1);
  return (
    <View style={styles.container}>
      <View style={styles.activityInfo}>
        <Text style={styles.activityType}>{activityType}</Text>
        <Text>{formattedDate}</Text>
      </View>
      <View style={[styles.activityInfo, styles.rightAligned]}>
        <Text style={styles.distanceNumber}>{activity.distanceMiles} mi</Text>
        <Text>Distance</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 20,
    marginLeft: 15,
    marginRight: 15,
    gap: 10,
  },
  activityInfo: {
    gap: 10,
  },
  activityType: { fontWeight: "bold", fontSize: 24 },

  distanceNumber: {
    fontWeight: "bold",
    fontSize: 20,
  },
  rightAligned: {
    alignItems: "flex-end",
  },
});
