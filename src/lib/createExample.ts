import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';

interface apiReturn {
  content: string;
  message: string;
}

interface apiProps {
  apiKey: string;
  wordName: string;
  wordLang: string;
  wordMean: string;
}

export interface generateExampleReturn {
	success: boolean;
    content: string;
    errorMessage: string;
	status: number;
}

/**
 * Axiosエラーか判定
 * @param error
 * @returns
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError)?.isAxiosError === true;
};
/**
 * README作成関数
 * @param content
 * @param model
 * @param role
 * @returns
 */
export const generateExample = async (props: apiProps):Promise<generateExampleReturn> => {
  const { apiKey, wordName, wordMean, wordLang } = props;
  try {
    const res = await axios.post<apiReturn>(
      'https://ray-boon-api.vercel.app/api',
      {
        apiKey: apiKey,
        wordName: wordName,
        wordLang: wordLang,
        wordMean: wordMean,
      }
    );

    return { success: true, content: res.data.content, errorMessage: '', status: res.status };
  } catch (error) {
    if (isAxiosError(error)) {
      const res = error.response as AxiosResponse<apiReturn, any>;
      return {success: false, content: '', errorMessage: res.data.message, status: res.status};
    }
    return {success: false, content: '', errorMessage: 'エラー', status: 500 };
  }
};
