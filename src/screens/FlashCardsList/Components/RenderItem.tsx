import { FC, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Popover } from './Popover';
import { useSetRecoilState } from 'recoil';
import { PopoverState } from '../../../atom/PopoverState';
import { FlashCardsDataState } from '../../../atom/FlashCardsDataState';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

interface RenderItemProps {
	id: number;
	name: string;
	onPressCard?: (id: number) => void;
}
export const RenderItem: FC<RenderItemProps> = ({ id, name, onPressCard }) => {
	const [showPopover, setShowPopover] = useState<boolean>(false);
	const setPopover = useSetRecoilState(PopoverState);
	const setData = useSetRecoilState(FlashCardsDataState);
	const handleTogglePopover = () => setShowPopover((prev) => !prev);
	const checkPopoverShow = () => {
		if (showPopover) {
			// 表示された場合
			setPopover(() => ({ currentId: id, visible: true }));
		}
	};
	useEffect(checkPopoverShow, [showPopover]);
	const deleteFlashCards = () => {
		Alert.alert('確認', `本当に単語帳「${name}」を削除しますか？`, [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => {
					setData((prev) => prev.filter((item) => item.id !== id));
					Toast.show({
						text1: `単語帳「${name}」を削除しました`,
						type: 'error',
						visibilityTime: 2000,
					});

				},
			},
		]);
	};
	return id > -1 && onPressCard ? (
		<TouchableOpacity
			style={styles.itemContainer}
			onPress={() => onPressCard(id)}
		>
			<Text style={styles.textContainer} numberOfLines={2} ellipsizeMode='tail'>{name}</Text>
			<TouchableOpacity
				style={styles.itemSettingButton}
				onPress={handleTogglePopover}
			>
				<SimpleLineIcons name="options" size={16} color="black" style={{ transform: [{ rotate: '90deg' }] }} />
			</TouchableOpacity>
			<Popover
				id={id}
				showPopover={showPopover}
				setShowPopover={setShowPopover}
				deleteFlashCards={deleteFlashCards}
			/>
		</TouchableOpacity>
	) : (
		<View style={{ ...styles.itemContainer, opacity: 0 }}></View>
	);
};

const styles = StyleSheet.create({
	itemContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 8,
		height: 55,
		backgroundColor: '#D9D9D9',
		position: 'relative',
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.5,
		shadowRadius: 3.5,
		// Android用の影
		elevation: 5,
	},
	itemSettingButton: {
		position: 'absolute',
		top: 15,
		right: 0,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	textContainer: {
		marginRight: 30,
		marginLeft: 30,
	},
});
