import { useNavigation } from "@react-navigation/native";
import { FC, useEffect, useState } from "react";
import { Linking } from "react-native";
import { useRecoilState } from "recoil";
import { APIKeyState } from "../../../atom/APIKeyState";
import { SettingPre } from "./SettingPre";

/**
 * 設定画面のロジック
 */
export const SettingCon: FC = () => {
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [apiKey, setApiKey] = useRecoilState(APIKeyState);
  const [inputValue, setInputValue] = useState(apiKey);

  const handleChangeText = (text: string) => {
    setInputValue(text);
  };
  const handleClickToggleEditModeButton = () => {
    setInputValue(apiKey);
    setIsEditMode((prev) => !prev);
  };
  const handleSave = () => {
    setApiKey(inputValue);
    handleClickToggleEditModeButton();
  };
  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsEditMode(false);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SettingPre
      isEditMode={isEditMode}
      apiKey={apiKey}
      inputValue={inputValue}
      handleClickToggleEditModeButton={handleClickToggleEditModeButton}
      handleChangeText={handleChangeText}
      handleSave={handleSave}
      handleLinkPress={handleLinkPress}
    />
  );
};
