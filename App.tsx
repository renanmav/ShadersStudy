import { NavigationContainer } from "@react-navigation/native";

import { StackNavigator } from "./src/StackNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
