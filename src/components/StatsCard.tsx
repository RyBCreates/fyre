import { StyleSheet, Text, View } from "react-native";

type StatsCardProps = {
  title: string;
  value: string;
  detailLabel: string;
  detailValue: string;
};
export default function StatsCard({
  title,
  value,
  detailLabel,
  detailValue,
}: StatsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.mainStats}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.informationContainer}>
        <Text style={styles.detailLabel}>{detailLabel}</Text>
        <Text style={styles.detailValue}>{detailValue}</Text>
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
    padding: 20,
    marginLeft: 15,
    marginRight: 15,
    gap: 10,
  },
  mainStats: {
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  value: {
    fontSize: 32,
    fontWeight: "bold",
  },
  informationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  detailValue: { fontSize: 14, color: "gray" },

  detailLabel: {
    fontWeight: "bold",
  },
});
