import { FC } from 'react';

import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';

interface SettingPreProps {
  isEditMode: boolean;
  apiKey: string;
  inputValue: string;
  difficulty: "easy" | "normal" | "hard";
  handleClickToggleEditModeButton: () => void;
  handleChangeText: (text: string) => void;
  handleSave: () => void;
  handleLinkPress: (url: string) => void;
  setDifficulty: (difficulty: "easy" | "normal" | "hard") => void;
}
/**
 * 設定画面のUI
 */
export const SettingPre: FC<SettingPreProps> = ({
  isEditMode,
  apiKey,
  inputValue,
  handleClickToggleEditModeButton,
  handleChangeText,
  handleSave,
  handleLinkPress,
  difficulty,
  setDifficulty,
}) => {
  return (
    <View style={styles.allView}>
      {isEditMode ? (
        <>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="APIキーを設定する"
              value={inputValue}
              onChangeText={handleChangeText}
              keyboardType="visible-password"
              autoFocus={true}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={handleClickToggleEditModeButton}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
              <Text style={styles.buttonText}>保存する</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.row, styles.rowHeight]}>
            <Text style={styles.label}>APIキー : </Text>
            <Text style={styles.apiKey}>
              {apiKey.length > 7
                ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 4)}`
                : apiKey || '未設定'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleClickToggleEditModeButton} style={styles.button}>
            <Text style={styles.buttonText}>APIキーを編集する</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={styles.textView}>
        <TouchableOpacity
          onPress={() => handleLinkPress('https://ray-boon-api.vercel.app/how-to-setting')}
        >
          <Text style={styles.link}>APIキーの取得方法</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLinkPress('https://ray-boon-api.vercel.app/PrivacyPolicy')}
        >
          <Text style={styles.link}>プライバシーポリシー</Text>
        </TouchableOpacity>
      </View>
      {/* 例文生成の難易度を設定する */}
      <View style={[styles.row, styles.rowHeight]}>
        <Text style={styles.label}>ChatGPT による例文生成の難易度 : </Text>
      </View>
      <View style={styles.difficultyRow}>
        <TouchableWithoutFeedback onPress={() => setDifficulty("easy")}>
          <View style={styles.difficulty}>
            <RadioButton.Android
              value="easy"
              status={difficulty === "easy" ? "checked" : "unchecked"}
              color="#4CAF50"
              id="easy"
            />
            <Text>簡単</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setDifficulty("normal")}>
          <View style={styles.difficulty}>
            <RadioButton.Android
              value="normal"
              status={difficulty === "normal" ? "checked" : "unchecked"}
              color="#FF9800"
              id="normal"
            />
            <Text>普通</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => setDifficulty("hard")}>
          <View style={styles.difficulty}>
            <RadioButton.Android
              value="hard"
              status={difficulty === "hard" ? "checked" : "unchecked"}
              onPress={() => setDifficulty("hard")}
              color="#F44336"
              id="hard"
            />
            <Text>難しい</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  allView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30,
  },
  row: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowHeight: {
    height: 40,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
  },
  apiKey: {
    fontSize: 16,
    flex: 1,
    marginLeft: 4,
    color: 'gray',
  },
  textView: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  button: {
    backgroundColor: '#5FA1DE',
    height: 40,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 30,
  },
  saveButton: {
    width: '49%',
    marginLeft: '2%',
  },
  cancelButton: {
    backgroundColor: 'white',
    width: '49%',
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  buttonText: {
    color: 'white',
  },
  cancelButtonText: {
    color: '#5FA1DE',
  },
  link: {
    padding: 10,
    color: '#06C3FF',
    textDecorationLine: 'underline',
    textAlign: 'right',
  },
  difficultyRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "90%",
  },
  difficulty: {
    flexDirection: "row",
    alignItems: "center",

  },
});
