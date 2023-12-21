import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "./Home";
import { CircleSDF } from "./CircleSDF";
import { LineSDF } from "./LineSDF";

const Stack = createNativeStackNavigator();

export function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CircleSDF" component={CircleSDF} />
      <Stack.Screen name="LineSDF" component={LineSDF} />
    </Stack.Navigator>
  );
}
