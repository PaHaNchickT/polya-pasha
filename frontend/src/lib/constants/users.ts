import { UserTypes } from "@/types/common";

export const USER_PHRASES = {
  polinka: [
    "Я рад, что именно ты стала моей спутницей для посещения всех этих мест!",
  ],
  admin: [
    '"Один шаг вперёд, один шаг назад", и вот мы здесь.',
    "Раньше маялись дурью поодиночке, давай теперь вместе?",
    "Всегда помни, что ты умничка!",
    "На каждого умного человека найдётся другой умный человек, и, кажется, мы нашлись.",
  ],
};

export const USERS_MAP = {
  admin: "Паша",
  polinka: "Поля",
  guest: "Гость",
};

export const USERS_KEYS = Object.keys(USERS_MAP) as UserTypes[];
