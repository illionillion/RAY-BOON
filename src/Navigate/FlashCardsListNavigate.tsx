import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StackParamList from "../StackParamList";
import { FlashCardsListCon } from "../screens/FlashCardsList/UI/FlashCardsListCon";
import { FlashCardsViewCon } from "../screens/FlashCardsView/UI/FlashCardsViewCon";

export const FlashCardsListNavigate = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: "#79BC6E", // ヘッダーの背景色を指定
        },
        headerTintColor: "white", // ヘッダーのテキスト色を指定
      })}
    >
      <Stack.Screen
        name="FlashCardsList"
        component={FlashCardsListCon}
        options={{ title: "単語帳一覧" }}
      />
      <Stack.Screen
        name="FlashCardsView"
        component={FlashCardsViewCon}
        options={({ route }) => ({
          title: (route.params as StackParamList["FlashCardsView"]).data.name || "",
        })}
      />
    </Stack.Navigator>
  );
};
