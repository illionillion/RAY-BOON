import { Ionicons } from '@expo/vector-icons';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRecoilValue } from 'recoil';
import { APIKeyState } from '../../../../atom/APIKeyState';
import { SentenceDiffState } from '../../../../atom/SentenceDiffState';
import { WordDef } from '../../../../atom/FlashCardsDataState';
import { generateExample, generateExampleReturn } from '../../../../lib/createExample';

interface WordCardProps {
  item: WordDef;
  setWordsData: Dispatch<SetStateAction<WordDef[]>>;
  OpenCreateExampleErrorMessage: (result: generateExampleReturn) => void;
}
export const WordCard: FC<WordCardProps> = ({
	item,
	setWordsData,
	OpenCreateExampleErrorMessage,
}) => {
	const { id, name, mean, lang, example } = item;
	const [wordName, setWordName] = useState<string>(name);
	const [wordMean, setWordMean] = useState<string>(mean);
	const [wordLang, setWordLang] = useState<string>(lang);
	const [wordExample, setWordExample] = useState<string>(example);
	const [wordExamplePreview, setWordExamplePreview] = useState<string>(example);
	const [loading, setLoading] = useState<boolean>(false);
	const apiKey = useRecoilValue(APIKeyState);
	const sentenceDiff = useRecoilValue(SentenceDiffState);
	const handleNameChanged = (text: string) => {
		setWordName(text);
	};
	const handleMeanChanged = (text: string) => {
		setWordMean(text);
	};
	const handleLangChanged = (text: string) => {
		setWordLang(text);
	};
	const handleExampleChanged = (text: string) => {
		setWordExample(text);
	};

	const upDateWord = () => {
		setWordsData((prev) =>
			prev.map((item) =>
				item.id === id
					? {
						id: id,
						name: wordName,
						mean: wordMean,
						lang: wordLang,
						example: wordExample,
					}
					: item,
			),
		);
	};

	const handleRemove = () => {
		setWordsData((prev) => prev.filter((item) => item.id !== id));
	};

	const handleCreateExample = async () => {
		if ([wordName, wordMean, wordLang].includes('')) {
			const errorMessage =
        wordName === ''
        	? '単語名を入力してください'
        	: wordMean === ''
        		? '単語の意味を入力してください'
        		: '単語の言語を入力してください';
			Toast.show({
				text1: errorMessage,
				type: 'error',
				visibilityTime: 2000,
			});
			return;
		}

		setLoading(true);

		// ここでChatGPTに送信したい
		const result = await generateExample({
			apiKey: apiKey,
			wordLang: wordLang,
			wordName: wordName,
			wordMean: wordMean,
			sentenceDiff: sentenceDiff,
		});

		const updateChar = async (i: number) => {
			return new Promise<void>((resolve) => {
				setTimeout(() => {
					const char = result.content[i];
					if (i === 0) {
						setWordExamplePreview(() => char);
					} else {
						setWordExamplePreview((prev) => prev + char);
					}
					resolve();
				}, 100);
			});
		};

		if (result.success) {
			setWordExample(() => result.content);
			for (let i = 0; i < result.content.length; i++) {
				await updateChar(i);
			}
		} else {
			OpenCreateExampleErrorMessage(result);
		}

		setLoading(false);
	};

	useEffect(() => {
		upDateWord();
	}, [wordName, wordMean, wordLang, wordExample]);

	return (
		<View style={styles.WordCard}>
			<View style={styles.row}>
				<TextInput
					style={styles.text}
					value={wordName}
					placeholder="単語名"
					onChangeText={handleNameChanged}
				/>
				<TextInput
					style={styles.text}
					value={wordMean}
					placeholder="単語の意味"
					onChangeText={handleMeanChanged}
				/>
			</View>
			<View style={styles.row}>
				<TextInput
					style={styles.text}
					value={wordLang}
					placeholder="単語の言語"
					onChangeText={handleLangChanged}
				/>
				<TouchableOpacity
					style={{ ...styles.text, ...styles.createExample }}
					onPress={handleCreateExample}
					disabled={loading}
				>
					<Text style={styles.createExampleText}>例文作成</Text>
				</TouchableOpacity>
			</View>
			<TextInput
				style={styles.textMulti}
				multiline
				value={loading ? wordExamplePreview : wordExample} // ここの値をChatGPTでリアルタイムに更新
				placeholder="例文"
				onChangeText={handleExampleChanged}
				editable={!loading}
			/>
			<TouchableOpacity style={styles.remove} onPress={handleRemove}>
				<Ionicons name="close" size={20} />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	WordCard: {
		flex: 1,
		width: '80%',
		height: 225,
		backgroundColor: '#D9D9D9',
		marginVertical: 22,
		marginHorizontal: '10%',
		paddingHorizontal: 20,
		paddingTop: 11,
		paddingBottom: 16,
		position: 'relative',
	},
	row: {
		paddingBottom: 12,
		gap: 8,
		flexDirection: 'row',
	},
	text: {
		flex: 0.5,
		paddingVertical: 5,
		paddingHorizontal: 8,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderRadius: 5,
		textAlign: 'center',
		fontSize: 20,
	},
	textMulti: {
		flex: 1,
		paddingVertical: 3,
		backgroundColor: '#fff',
		fontSize: 20,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	createExample: {
		backgroundColor: '#5C98B9',
	},
	createExampleText: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 20,
	},
	remove: {
		width: 44,
		height: 44,
		backgroundColor: '#FF9D9D',
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center',
		top: -22,
		right: -22,
		position: 'absolute',
	},
});
