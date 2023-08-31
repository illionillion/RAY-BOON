import type { FC } from 'react';
import type { Proficiency, WordDef } from '../../../atom/FlashCardsDataState';
import type StackParamList from '../../../StackParamList';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { generateExampleReturn } from '../../../lib/createExample';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FlashCardsDataState } from '../../../atom/FlashCardsDataState';
import { generateExample} from '../../../lib/createExample';

import { FlashCardsViewPre } from './FlashCardsViewPre';
import { APIKeyState } from '../../../atom/APIKeyState';
import { SentenceDiffState } from '../../../atom/SentenceDiffState';

type FlashCardsViewRouteProp = RouteProp<StackParamList, 'FlashCardsView'>;

export interface FlashCardsListConProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
  route: FlashCardsViewRouteProp;
}

export const FlashCardsViewCon: FC<FlashCardsListConProps> = (props) => {
  const { route, navigation } = props;
  const { id, name, words } = route.params.data;
  const [flashcardName, setFlashcardName] = useState<string>(name);
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const [wordsData, setWordsData] = useState<WordDef[]>(words);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [wordExamplePreview, setWordExamplePreview] = useState<string>('');
  const [newExample, setNewExample] = useState<string>('');
  const [data, setData] = useRecoilState(FlashCardsDataState);
  const item = wordsData.find((item) => item.id === activeId || null);
  const [wordName, setWordName] = useState<string>(item?.name || '');
  const [wordMean, setWordMean] = useState<string>(item?.mean || '');
  const [wordLang, setWordLang] = useState<string>(item?.lang || '');
  const [wordExample, setWordExample] = useState<string>(item?.example || '');
  const apiKey = useRecoilValue(APIKeyState);
  const [newWord, setNewWord] = useState<string>('');
  const [newMean, setNewMean] = useState<string>('');
  const [newLang, setNewLang] = useState<string>('');
  const sentenceDiff = useRecoilValue(SentenceDiffState);

  const handleNameChanged = (text: string) => {
    setFlashcardName(text);
    setButtonDisable(text.trim() === '');
  };
  const handleOpen = () => {
    setIsAddOpen(true);
  };

  const handleClose = () => {
    setIsAddOpen(false);
    setNewExample('');
    setLoading(false);
  };

  const handleEditOpen = () => {
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    const currentItem = wordsData.find((item) => item.id === activeId);
    setWordName(currentItem?.name || '');
    setWordMean(currentItem?.mean || '');
    setWordLang(currentItem?.lang || '');
    setWordExample(currentItem?.example || '');

    setIsEditOpen(false);
  };
  const handleNameEditChanged = (text: string) => {
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

  const handleRemove = () => {
    setWordsData((prev) => prev.filter((currentItem) => currentItem.id !== item?.id));
  };
  const handleAdd = () => {
    if([newWord, newMean].includes('')) {
      const errorMessage =
      newWord === ''
        ? '単語名は入力必須項目です。'
        : '単語の意味は入力必須項目です。';
      Toast.show({
        text1: errorMessage,
        type: 'error',
        visibilityTime: 2000,
      });
      return;
    }

    setLoading(true);

    const newWordDef = {
      id: (() => {
        if (wordsData.length === 0) {
          return 0;
        }
      
        const maxId = wordsData.reduce((max, card) => {
          return Math.max(max, card.id);
        }, -1);
      
        return maxId + 1;
      })(),
      name: newWord,
      lang: newLang,
      mean: newMean,
      example: newExample,
      proficiency: 'learning' as Proficiency,
    };

    handleAddNewWord(newWordDef);

    setNewWord('');
    setNewMean('');
    setNewLang('');
    setNewExample('');
    handleClose();
  };
  const handleEdit = () => {
    if([wordName, wordMean].includes('')) {
      const errorMessage =
      wordName === ''
        ? '単語名は入力必須項目です。'
        : '単語の意味は入力必須項目です。';
      Toast.show({
        text1: errorMessage,
        type: 'error',
        visibilityTime: 2000,
      });
      return;
    }

    setLoading(true);

    setWordsData((prev) => 
      prev.map((currentItem) => 
        currentItem.id === item?.id
          ? {
            ...currentItem,
            name: wordName,
            mean: wordMean,
            lang: wordLang,
            example: wordExample
          }
          : currentItem
      )
    );
    handleEditClose();
    setLoading(false);
  };

  const handleSave = () => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            id: id,
            name: flashcardName,
            words: wordsData,
          }
          : item,
      ),
    );
    Toast.show({
      text1: '変更を保存しました',
      type: 'success',
      visibilityTime: 2000,
    });
  };
  const onPressToSlide = () => {
    navigation.navigate('Slide', {
      id: id,
      title: flashcardName,
      data: wordsData,
    });
  };
  const OpenCreateExampleErrorMessage = (result: generateExampleReturn) => {
    const message =
      result.status === 503 ? '時間をおいてもう一度試してください。' : result.errorMessage;
    Alert.alert('例文作成に失敗しました。', message, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => navigation.navigate('Setting'),
      },
    ]);
  };
  const handleAddNewWord = (newWord: WordDef) => {
    setWordsData((prev) => [...prev, newWord]);
  };
  const handleCreateExample = async (
    newWord: string,
    newMean: string,
    newLang: string,
    apiKey: string,
    modalType: 'add' | 'edit'
  ) => {
    if ([newWord, newMean, newLang].includes('')) {
      const errorMessage =
        newWord === ''
          ? '単語名を入力してください'
          : newMean === ''
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
      wordLang: newLang,
      wordName: newWord,
      wordMean: newMean,
      sentenceDiff: sentenceDiff,
    });

    const updateChar = async (i: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const char = result.content[i];
          if (i === 0) {
            if (modalType === 'add') {
              setNewExample(() => char);
            } else {
              setWordExamplePreview(() => char);
            }
          } else {
            if (modalType === 'add') {
              setNewExample((prev) => prev + char);
            } else {
              setWordExamplePreview((prev) => prev + char);
            }
          }
          resolve();
        }, 100);
      });
    };

    if (result.success) {
      if (modalType === 'add') {
        setNewExample(() => result.content);
      }
      for (let i = 0; i < result.content.length; i++) {
        await updateChar(i);
      }
    } else {
      OpenCreateExampleErrorMessage(result);
    }
  
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (navigation.getState().routes[navigation.getState().index].name !== 'Slide') {
        navigation.goBack();
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(()=>{
    setWordsData(() => data.find(item => item.id === id)?.words || []);
  },[data]);
  useEffect(() => {
    setWordName(item?.name || '');
    setWordMean(item?.mean || '');
    setWordLang(item?.lang || '');
    setWordExample(item?.example || '');
  }, [item]);
  useEffect(() => {
    const currentItem = wordsData.find((item) => item.id === activeId);
    if (currentItem) {
      setWordExamplePreview(currentItem.example);
    } else {
      setWordExamplePreview(''); 
    }
  }, [activeId, wordsData]);


  return (
    <FlashCardsViewPre
      {...{
        flashcardName,
        buttonDisable,
        wordsData,
        isAddOpen,
        isEditOpen,
        activeId,
        loading,
        wordName,
        wordMean,
        wordLang,
        wordExample,
        apiKey,
        wordExamplePreview,
        newExample,
        newWord,
        newMean,
        newLang,
        handleNameChanged,
        handleSave,
        handleOpen,
        handleClose,
        handleEditOpen,
        handleEditClose,
        setActiveId,
        handleCreateExample,
        setNewExample,
        setLoading,
        onPressToSlide,
        handleNameEditChanged,
        handleMeanChanged,
        handleLangChanged,
        handleExampleChanged,
        handleRemove,
        handleEdit,
        setNewWord,
        setNewMean,
        setNewLang,
        handleAdd,
      }}
    />
  );
};
