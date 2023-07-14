/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigationProp, RouteProp } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { FC, useEffect, useState } from 'react';
import StackParamList from '../../../StackParamList';
import { SlidePre } from './SlidePre';

type FlashCardsViewRouteProp = RouteProp<StackParamList, 'Slide'>;
interface SlideConProps {
  navigation: NavigationProp<any, any>;
  route: FlashCardsViewRouteProp;
}

export const SlideCon: FC<SlideConProps> = ({ navigation, route }) => {
  const { data } = route.params;
  const [page, setPage] = useState(0);
  const [isFront, setIsFront] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const pageTotal = data.length;

  const handleSpeechStop = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePageChange = (page: number) => {
    if (page >= 0 && page <= pageTotal - 1) {
      if (isSpeaking) handleSpeechStop();
      setPage(page);
      setIsFront(true);
    }
  };

  const handleFlip = () => {
    if (isSpeaking) handleSpeechStop();
    setIsFront(!isFront);
  };

  const handlePressSpeaker = (text: string) => {
    if (isSpeaking) {
      handleSpeechStop();
    } else {
      Speech.speak(text, {
        // language: 'en',
        rate: 1.0,
        pitch: 1.0,
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
      });
    }
  };

  useEffect(() => {
    const blurUnsubscribe = navigation.addListener('blur', handleSpeechStop);
    const beforeRemoveUnsubscribe = navigation.addListener('beforeRemove', handleSpeechStop);
    return () => {
      blurUnsubscribe();
      beforeRemoveUnsubscribe();
    };
  }, [navigation]);

  return (
    <SlidePre
      word_list={data}
      page={page}
      isFront={isFront}
      isSpeaking={isSpeaking}
      handleGoBack={handleGoBack}
      handleFlip={handleFlip}
      handlePageChange={handlePageChange}
      handlePressSpeaker={handlePressSpeaker}
    />
  );
};
