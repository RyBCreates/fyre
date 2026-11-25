import { StyleSheet, Text, View } from "react-native";

type AllTimeStatsCardProps = {
  miles: number;
  totalRuns: number;
};
export default function AllTimeStatsCard({
  miles,
  totalRuns,
}: AllTimeStatsCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>This Week</Text>
      <Text style={styles.distance}>{miles} miles</Text>
      <View style={styles.informationContainer}>
        <Text style={styles.description}>Total Runs</Text>
        <Text style={styles.totalRuns}>{totalRuns}</Text>
      </View>
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
  informationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  description: { fontSize: 14, color: "gray" },

  totalRuns: {
    fontWeight: "bold",
  },
});
