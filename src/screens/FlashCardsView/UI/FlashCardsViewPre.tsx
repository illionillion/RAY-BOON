import { Ionicons } from '@expo/vector-icons';
import type { Dispatch, FC, SetStateAction} from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { WordDef } from '../../../atom/FlashCardsDataState';
import { WordCard } from './Components/WordCard';
import { AddWordModal } from './Components/AddWordModal';
import { EditWordModal } from './Components/EditWordModal';

export interface FlashCardsListPreProps {
  flashcardName: string;
  buttonDisable: boolean;
  wordsData: WordDef[];
  isAddOpen: boolean;
  isEditOpen: boolean;
  activeId: number | null;
  loading: boolean;
  wordName: string;
  wordMean: string;
  wordLang: string;
  wordExample: string;
  apiKey: string;
  wordExamplePreview: string;
  newExample: string;
  newWord: string;
  newMean: string;
  newLang: string;
  handleNameChanged: (text: string) => void;
  handleSave: () => void;
  onPressToSlide: () => void;
  handleOpen: () => void;
  handleClose: () => void;
  handleEditOpen: () => void;
  handleEditClose: () => void;
  setActiveId: Dispatch<SetStateAction<number | null>>;
  handleCreateExample: (newWord: string, newMean: string, newLang: string, apiKey: string, modalType: 'add' | 'edit') => Promise<void>;
  setNewExample: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  handleNameEditChanged: (text: string) => void;
  handleMeanChanged: (text: string) => void;
  handleLangChanged: (text: string) => void;
  handleExampleChanged: (text: string) => void;
  handleRemove: () => void;
  handleEdit: () => void;
  setNewWord: Dispatch<SetStateAction<string>>;
  setNewMean: Dispatch<SetStateAction<string>>;
  setNewLang: Dispatch<SetStateAction<string>>;
  handleAdd: () => void;
}

export const FlashCardsViewPre: FC<FlashCardsListPreProps> = (props) => {
  const {
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
    onPressToSlide,
    handleOpen,
    handleClose,
    handleEditOpen,
    handleEditClose,
    setActiveId,
    handleCreateExample,
    setNewExample,
    setLoading,
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
  } = props;
  return (
    <>
      <View style={styles.FlashCardsContainer}>
        <View style={styles.FlashCardsTitleContainer}>
          <TextInput
            value={flashcardName}
            placeholder="単語帳名を入力"
            style={styles.FlashCardsTitleInput}
            onChangeText={handleNameChanged}
          />
        </View>
        <ScrollView style={styles.FlashScrollContainer} showsVerticalScrollIndicator={false} scrollEnabled={false}>
          {wordsData.map((item) => (
            <TouchableOpacity 
              key={item.id}
              onPress={() => {
                setActiveId(item.id);
                handleEditOpen();
              }}>
              <WordCard
                item={item}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.FlashCardsBottom}>
          <TouchableOpacity
            style={{ ...styles.SaveButton, ...styles.ButtonCommon }}
            disabled={buttonDisable}
            onPress={handleSave}
          >
            <Text style={styles.SaveButtonText}>保存する</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.SlideButton, ...styles.ButtonCommon }}
            disabled={wordsData.length === 0 ? true : false}
            onPress={onPressToSlide}
          >
            <Text style={styles.SlideButtonText}>スライドショー</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.PlusButton} onPress={handleOpen}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <AddWordModal
        {...{
          isAddOpen,
          loading,
          newExample,
          newWord,
          newMean,
          newLang,
          apiKey,
          setNewExample,
          setLoading,
          setNewWord,
          setNewMean,
          setNewLang,
          handleClose,
          handleCreateExample,
          handleAdd,
        }}
      />
      {activeId !== null && (
        <EditWordModal
          {...{
            isEditOpen,
            loading,
            wordExamplePreview,
            wordName,
            wordMean,
            wordLang,
            wordExample,
            apiKey,
            handleEditClose,
            handleCreateExample,
            handleNameEditChanged,
            handleMeanChanged,
            handleLangChanged,
            handleExampleChanged,
            handleRemove,
            handleEdit,
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  FlashCardsContainer: {
    position: 'relative',
    flex: 1,
  },
  FlashCardsTitleContainer: {
    paddingTop: 37,
    paddingBottom: 28,
    paddingHorizontal: 28,
  },
  FlashCardsTitleInput: {
    paddingHorizontal: 18,
    height: 38,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    borderRadius: 5,
    fontSize: 20,
  },
  FlashScrollContainer: {
    flexGrow: 1,
  },

  FlashCardsBottom: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ButtonCommon: {
    width: 130,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  SaveButton: {
    backgroundColor: '#5FA1DE',
  },
  SaveButtonText: {
    color: '#fff',
    fontSize: 15,
  },
  SlideButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  SlideButtonText: {
    fontSize: 15,
  },
  PlusButton: {
    backgroundColor: '#599D4D',
    justifyContent: 'center',
    alignItems: 'center',
    width: 53,
    height: 53,
    borderRadius: 50,
  },
});
