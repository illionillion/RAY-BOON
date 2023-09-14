import { Ionicons } from '@expo/vector-icons';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRecoilValue } from 'recoil';
import { APIKeyState } from '../../../../atom/APIKeyState';
import type { WordDef } from '../../../../atom/FlashCardsDataState';
import type { generateExampleReturn } from '../../../../lib/createExample';
import { generateExample } from '../../../../lib/createExample';
import { ExampleScentence } from './ExampleScentence';

// プレビューと例文のセットの型
interface Examples {
  preview: string
  example: string
}

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
  const { id, name, mean, lang, example, proficiency } = item;
  const [wordName, setWordName] = useState<string>(name);
  const [wordMean, setWordMean] = useState<string>(mean);
  const [wordLang, setWordLang] = useState<string>(lang);
  // const [wordExamples, setWordExamples] = useState<string[]>([example]);
  // const [wordExamplePreviews, setWordExamplePreviews] = useState<string[]>([example]);
  const [wordExamples, setWordExamples] = useState<Examples[]>([
    { preview: example, example: example },
    { preview: '', example: '' },
    { preview: '', example: '' }
  ]);
  const [selectedindex, setSelectedIndex] = useState<number>(0); // 選択された例文のインデックス
  const [loading, setLoading] = useState<boolean[]>([false, false, false]);
  const apiKey = useRecoilValue(APIKeyState);
  const handleNameChanged = (text: string) => {
    setWordName(text);
  };
  const handleMeanChanged = (text: string) => {
    setWordMean(text);
  };
  const handleLangChanged = (text: string) => {
    setWordLang(text);
  };

  // // 指定した index の例文テキストを変更します
  const handleExampleChanged = (text: string, index: number) => {
    // setWordExamples((prev) => prev.map((item, i) => i === index ? text : item));
    setWordExamples((prev) => {
      const newWordExamples = [...prev];
      newWordExamples[index].example = text;
      return newWordExamples;
    }
    );
  };

  // // 指定した index の例文プレビューを変更します
  const handleExamplePreviewChanged = (text: string, index: number) => {
    // setWordExamplePreviews((prev) => prev.map((item, i) => i === index ? text : item));
    setWordExamples((prev) => {
      const newWordExamplePreviews = [...prev];
      newWordExamplePreviews[index].preview = text;
      return newWordExamplePreviews;
    }
    );
  };

  // 指定した index の loading を変更します
  const handleLoadingChanged = (value: boolean, index: number) => {
    setLoading((prevloading) => prevloading.map((item, i) => i === index ? value : item));
  };


  const upDateWord = () => {
    const selectedWordExample = wordExamples[selectedindex].example;
    setWordsData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            id: id,
            name: wordName,
            mean: wordMean,
            lang: wordLang,
            example: selectedWordExample,
            proficiency: proficiency,
          }
          : item,
      ),
    );
  };

  const handleRemove = () => {
    setWordsData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreateExample = async (index: number) => {
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

    handleLoadingChanged(true, index);

    // ここでChatGPTに送信したい

    const result = await generateExample({
      apiKey: apiKey,
      wordLang: wordLang,
      wordName: wordName,
      wordMean: wordMean,
    });

    const updateChar = async (i: number) => {
      // console.log('wordExamplePreviews[index] + char: ', wordExamplePreviews[index] + result.content[i]);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const char = result.content[i];
          if (i === 0) {
            // previewを更新
            handleExamplePreviewChanged(char, index);
          } else {
            // previewを更新
            handleExamplePreviewChanged(wordExamples[index].preview + char, index);
          }
          resolve();
        }, 100);
      });
    };

    if (result.success) {
      // exampleを更新
      handleExampleChanged(result.content, index);
      for (let i = 0; i < result.content.length; i++) {
        await updateChar(i);
      }
    } else {
      OpenCreateExampleErrorMessage(result);
    }
    handleLoadingChanged(false, index);
  };

  useEffect(() => {
    upDateWord();
  }, [wordName, wordMean, wordLang, wordExamples]);

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
          disabled={loading[0] || loading[1] || loading[2]}
          onPress={() => {
            handleCreateExample(0);
            handleCreateExample(1);
            handleCreateExample(2);
          }}
        >
          <Text style={styles.createExampleText}>例文作成</Text>
        </TouchableOpacity>
      </View>
      {/* 例文コンポーネントの表示 */}
      {
        wordExamples.map((_, index) => (
          <ExampleScentence
            key={index}
            index={index}
            loading={loading[index]}
            wordExample={wordExamples[index].example}
            wordExamplePreview={wordExamples[index].preview}
            handleExampleChanged={handleExampleChanged}
          />))
      }

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
    // height: 225,
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
