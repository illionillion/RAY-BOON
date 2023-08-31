import type { FC } from 'react';
import { useState } from 'react';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { FlashCardsDataState, NextAvailableIdSelector } from '../../../atom/FlashCardsDataState';
import { FlashCardsCreatePre } from './FlashCardsCreatePre';

/**
 * 単語帳作成画面のロジック
 */
export const FlashCardsCreateCon: FC = () => {
  const [flashcardName, setFlashcardName] = useState<string>('');
  const [buttonDisable, setButtonDisable] = useState<boolean>(true);
  const setData = useSetRecoilState(FlashCardsDataState);
  const nextId = useRecoilValue(NextAvailableIdSelector);
  const handleNameChanged = (text: string) => {
    setFlashcardName(text);
    setButtonDisable(text.trim() === '');
  };
  const handleCreateFlashcard = () => {
    setData((prev) => [
      ...prev,
      {
        id: nextId,
        name: flashcardName,
        words: [],
      },
    ]);
    Toast.show({
      text1: `単語帳「${flashcardName}」を作成しました`,
      type: 'success',
      visibilityTime: 2000,
    });
    handleNameChanged('');
  };

  return (
    <FlashCardsCreatePre
      flashcardName={flashcardName}
      handleCreateFlashcard={handleCreateFlashcard}
      handleNameChanged={handleNameChanged}
      buttonDisable={buttonDisable}
    />
  );
};
