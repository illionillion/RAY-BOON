import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import StackParamList from '../StackParamList';
import { FlashCardsListCon } from '../screens/FlashCardsList/UI/FlashCardsListCon';
import { FlashCardsViewCon } from '../screens/FlashCardsView/UI/FlashCardsViewCon';
import { SlideCon } from '../screens/Slide/UI/SlideCon';
import { Button } from 'react-native';
import { FlashCardsDataState, FlashCardsDef } from '../atom/FlashCardsDataState';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export const FlashCardsListNavigate: FC = () => {
	var data = useRecoilValue<FlashCardsDef[]>(FlashCardsDataState);
	const setData = useSetRecoilState(FlashCardsDataState);

	const handleSort = () => {
		data = [...data].sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			} else {
				return 1;
			}
		});
		setData(data);
	}

	const Stack = createNativeStackNavigator();

	return (
		<Stack.Navigator
			screenOptions={() => ({
				tabBarActiveTintColor: 'green',
				tabBarInactiveTintColor: 'gray',
				headerStyle: {
					backgroundColor: '#79BC6E', // ヘッダーの背景色を指定
					elevation: 0, // ヘッダーの上部の余白を除去
				},
				headerTintColor: 'white', // ヘッダーのテキスト色を指定
				headerTitleAlign: 'center',
				headerStatusBarHeight: 0, // ヘッダーの上部の余白を除去
			})}
		>
			<Stack.Screen
				name="FlashCardsList"
				component={FlashCardsListCon}
				options={{
					title: '単語帳一覧',
					headerRight: () => (
						<Button title='名前順' onPress={() => handleSort()} color={'white'} />
					)
				}}
			/>
			<Stack.Screen
				name="FlashCardsView"
				// @ts-ignore
				component={FlashCardsViewCon}
				options={({ route }) => ({
					title: (route.params as StackParamList['FlashCardsView']).data.name || '',
				})}
			/>
			<Stack.Screen
				name="Slide"
				// @ts-ignore
				component={SlideCon}
				options={({ route }) => ({
					title: (route.params as StackParamList['Slide']).title
						? `${(route.params as StackParamList['Slide']).title} - スライド`
						: 'スライド',
				})}
			/>
		</Stack.Navigator>
	);
};
