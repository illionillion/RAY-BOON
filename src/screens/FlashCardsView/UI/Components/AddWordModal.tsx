import type { Dispatch, FC, SetStateAction} from 'react';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { Proficiency, WordDef } from '../../../../atom/FlashCardsDataState';
import { useRecoilValue } from 'recoil';
import { APIKeyState } from '../../../../atom/APIKeyState';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

interface AddWordModalProps {
    isAddOpen: boolean;
    loading: boolean;
    wordExamplePreview: string;
    newExample: string;
    handleClose: () => void;
    handleAddNewWord: (newWord: WordDef) => void;
    handleCreateExample: (newWord: string, newMean: string, newLang: string, apiKey: string) => Promise<void>;
    setNewExample: Dispatch<SetStateAction<string>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

export const AddWordModal: FC<AddWordModalProps> = ({ 
  isAddOpen, 
  loading,
  wordExamplePreview,
  newExample,
  setNewExample,
  handleClose, 
  handleAddNewWord,
  handleCreateExample,
  setLoading
}) => {
  const [newWord, setNewWord] = useState<string>('');
  const [newMean, setNewMean] = useState<string>('');
  const [newLang, setNewLang] = useState<string>('');
  const [wordsData, setWordsData] = useState<WordDef[]>([]);
  const apiKey = useRecoilValue(APIKeyState);

  const handleAdd = () => {
    if(!newWord){
      Toast.show({
        text1: '単語名は必須項目です。',
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

    setWordsData((prev) => [...prev, newWordDef]);
    handleAddNewWord(newWordDef);

    setNewWord('');
    setNewMean('');
    setNewLang('');
    setNewExample('');
    handleClose();
  };

  return (
    <>
      {isAddOpen && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.row}>
              <TextInput
                style={styles.text}
                value={newWord}
                placeholder="単語名"
                onChangeText={setNewWord}
              />
              <TextInput
                style={styles.text}
                value={newMean}
                placeholder="単語の意味"
                onChangeText={setNewMean}  
              />
            </View>
            <View style={styles.row}>
              <TextInput
                style={styles.text}
                value={newLang}
                placeholder="単語の言語"
                onChangeText={setNewLang}
              />
              <TouchableOpacity
                style={{ ...styles.text, ...styles.createExample }}
                disabled={loading}
                onPress={() => handleCreateExample(newWord, newMean, newLang, apiKey)}
              >
                <Text style={styles.createExampleText}>例文作成</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textMulti}
              value={loading ? wordExamplePreview : newExample}
              placeholder="例文"
              onChangeText={setNewExample}
            />
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity 
              style={{...styles.button, ...styles.addButton}}
              disabled={loading}
              onPress={handleAdd}
            >
              <Text style={styles.buttonText}>追加する</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{...styles.button, ...styles.closeButton}}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}      
    </>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '80%',
    height: 225,
    backgroundColor: '#D9D9D9',
    marginVertical: 22,
    marginHorizontal: '10%',
    paddingHorizontal: 20,
    paddingTop: 11,
    paddingBottom: 16,
    position: 'relative',
    borderRadius: 10,
    zIndex: 1001,
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
  buttons: {
    paddingBottom: 12,
    gap: 20,
    flexDirection: 'row',
  },
  button: {
    width: 110,
    height: 50,
    borderRadius: 5,
    textAlign: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#5FA1DE',
  },
  closeButton: {
    backgroundColor: '#FF9D9D',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
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
});