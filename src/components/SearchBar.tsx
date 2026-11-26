import { Ionicons } from "@react-native-vector-icons/ionicons";
import { StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
};
export default function SearchBar({
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color="#777777" />
      <TextInput
        style={styles.searchBar}
        placeholder="Search for nearby runs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 5,
  },
  searchBar: {
    paddingLeft: 10,
    flex: 1,
  },
});
