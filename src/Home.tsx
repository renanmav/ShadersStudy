import { useCallback } from "react";
import { ScrollView, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Screen = {
  name: string;
  routeName: string;
};

const screens: Array<Screen> = [
  {
    name: "⭕️ SDF of a Circle",
    routeName: "CircleSDF",
  },
  {
    name: "😵‍💫 SDF of a Line",
    routeName: "LineSDF",
  },
  {
    name: "🎨 Look Up Table (LUT)",
    routeName: "LUT",
  },
];

export function Home() {
  const { navigate } = useNavigation<any>();

  const handleScreenPress = useCallback((routeName: string) => {
    return () => navigate(routeName);
  }, []);

  return (
    <ScrollView>
      {screens.map((screen) => (
        <Pressable
          key={screen.routeName}
          onPress={handleScreenPress(screen.routeName)}
          style={styles.screen}
        >
          <Text style={styles.title}>{screen.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 16,
  },
});
