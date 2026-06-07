import { USER_PHRASES } from "../constants/users";

export const getRandomPhrase = (key?: keyof typeof USER_PHRASES): string => {
  if (!key) return "";

  const phrases = USER_PHRASES[key];
  const randomIndex = Math.floor(Math.random() * phrases.length);

  return phrases[randomIndex];
};
