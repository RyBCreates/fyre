import { StyleSheet, Text, View } from "react-native";

type WeeklyStatsCardProps = {
  miles: number;
  totalRuns: number;
};
export default function WeeklyStatsCard({
  miles,
  totalRuns,
}: WeeklyStatsCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>This Week</Text>
      <Text style={styles.distance}>{miles} miles</Text>
      <Text style={styles.description}>{totalRuns} runs this week</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    alignItems: "flex-start",
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 20,
    marginLeft: 15,
    marginRight: 15,

    gap: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  distance: {
    fontSize: 32,
    fontWeight: "bold",
  },
  description: { fontSize: 14, color: "gray" },
});
