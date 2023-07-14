import { atom } from 'recoil';

export const SentenceDiffState = atom<'easy' | 'normal' | 'hard'>({
  key: 'SentenceDiffState',
  default: 'normal',
});