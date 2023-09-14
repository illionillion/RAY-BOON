import React, { FC }  from "react";
import { View, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface ExampleScentenceProps {
  index: number;
  loading: boolean;
  wordExample: string;
  wordExamplePreview: string;
  handleExampleChanged: (text: string, index: number) => void;
}

export const ExampleScentence: FC<ExampleScentenceProps> = ({
  index,
  loading,
  wordExample,
  wordExamplePreview,
  handleExampleChanged,
}) => {
  // console.log("loading: ", loading)
  // console.log("wordExamplePreview: ", wordExamplePreview)
  return (
    <View>
      <TextInput
        style={styles.textMulti}
        multiline
        value={loading ? wordExamplePreview : wordExample} // ここの値をChatGPTでリアルタイムに更新
        placeholder="例文"
        editable={!loading}
        onChangeText={(text) => handleExampleChanged(text, index)}
      />
    </View >
  );
};


const styles = StyleSheet.create({
  textMulti: {
    flex: 1,
    paddingVertical: 3,
    backgroundColor: '#fff',
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});
