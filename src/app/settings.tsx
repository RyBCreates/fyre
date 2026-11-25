import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const handleDeleteProfile = () => {
    Alert.alert("Delete Profile", "Are You Sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete Profile",
        style: "destructive",
        onPress: async () => {
          try {
            const keysToDelete = [
              "fyreUserData",
              "fyreMiles",
              "fyreTotalRuns",
              "fyreActivities",
            ];
            await AsyncStorage.multiRemove(keysToDelete);
            console.log("Profile has successfully been Deleted!");
          } catch (error) {
            console.error("There was an error deleting the profile.", error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Settings</Text>
      <Pressable onPress={handleDeleteProfile}>
        <Text>Delete Profile</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF6B35",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    gap: 24,
  },
});
