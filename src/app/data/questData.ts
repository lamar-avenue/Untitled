export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestLevel {
  id: number;
  title: string;
  task: string;
  options: Option[];
  keySymbol: string;
  type?: 'video' | 'text';
  videoUrl?: string;
  pauseTime?: number; // seconds
}

export const questLevels: QuestLevel[] = [
  {
    id: 1,
    title: "Уровень 1/12",
    task: "Как назывался первый проект, над которым мы работали вместе?",
    keySymbol: "H",
    options: [
      { id: "a", text: "Alpha Project", isCorrect: false },
      { id: "b", text: "First Step", isCorrect: true },
      { id: "c", text: "Genesis", isCorrect: false },
      { id: "d", text: "Legacy", isCorrect: false },
    ],
  },
  {
    id: 2,
    title: "Уровень 2/12",
    task: "В каком году произошла наша первая встреча?",
    keySymbol: "B",
    options: [
      { id: "a", text: "2018", isCorrect: false },
      { id: "b", text: "2019", isCorrect: true },
      { id: "c", text: "2020", isCorrect: false },
      { id: "d", text: "2021", isCorrect: false },
    ],
  },
  {
    id: 3,
    title: "Уровень 3/12 (Спецзадание)",
    task: "Внимательно посмотри видео. Что произойдет дальше?",
    type: 'video',
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    pauseTime: 5,
    keySymbol: "D",
    options: [
      { id: "a", text: "Появится комета", isCorrect: true },
      { id: "b", text: "Начнется дождь", isCorrect: false },
      { id: "c", text: "Взойдет луна", isCorrect: false },
      { id: "d", text: "Ничего не изменится", isCorrect: false },
    ],
  },
  {
    id: 4,
    title: "Уровень 4/12",
    task: "Какой твой любимый язык программирования (или тот, который ты больше всего хейтишь)?",
    keySymbol: "M",
    options: [
      { id: "a", text: "TypeScript", isCorrect: true },
      { id: "b", text: "PHP", isCorrect: false },
      { id: "c", text: "C++", isCorrect: false },
      { id: "d", text: "Python", isCorrect: false },
    ],
  },
  {
    id: 5,
    title: "Уровень 5/12",
    task: "Где был сделан тот самый легендарный снимок в горах?",
    keySymbol: "A",
    options: [
      { id: "a", text: "Алтай", isCorrect: false },
      { id: "b", text: "Кавказ", isCorrect: true },
      { id: "c", text: "Урал", isCorrect: false },
      { id: "d", text: "Альпы", isCorrect: false },
    ],
  },
  {
    id: 6,
    title: "Уровень 6/12",
    task: "Сколько чашек кофе ты выпиваешь в день во время дедлайна?",
    keySymbol: "R",
    options: [
      { id: "a", text: "1-2", isCorrect: false },
      { id: "b", text: "3-5", isCorrect: true },
      { id: "c", text: "Сбился со счета", isCorrect: false },
      { id: "d", text: "Не пью кофе", isCorrect: false },
    ],
  },
  {
    id: 7,
    title: "Уровень 7/12",
    task: "Какое кодовое название было у нашего чата в Telegram изначально?",
    keySymbol: "K",
    options: [
      { id: "a", text: "Dev Team", isCorrect: false },
      { id: "b", text: "Secret Lab", isCorrect: true },
      { id: "c", text: "Bunker", isCorrect: false },
      { id: "d", text: "The Group", isCorrect: false },
    ],
  },
  {
    id: 8,
    title: "Уровень 8/12",
    task: "В какой игре мы провели больше всего времени вместе?",
    keySymbol: "2",
    options: [
      { id: "a", text: "Dota 2", isCorrect: false },
      { id: "b", text: "CS:GO", isCorrect: true },
      { id: "c", text: "Minecraft", isCorrect: false },
      { id: "d", text: "WoW", isCorrect: false },
    ],
  },
  {
    id: 9,
    title: "Уровень 9/12",
    task: "Какая была первая машина, на которой мы катались?",
    keySymbol: "0",
    options: [
      { id: "a", text: "BMW", isCorrect: false },
      { id: "b", text: "Lada", isCorrect: true },
      { id: "c", text: "Toyota", isCorrect: false },
      { id: "d", text: "Tesla", isCorrect: false },
    ],
  },
  {
    id: 10,
    title: "Уровень 10/12",
    task: "Что ты выбрал: фронтенд или бэкенд?",
    keySymbol: "2",
    options: [
      { id: "a", text: "Frontend", isCorrect: true },
      { id: "b", text: "Backend", isCorrect: false },
      { id: "c", text: "DevOps", isCorrect: false },
      { id: "d", text: "Fullstack", isCorrect: false },
    ],
  },
  {
    id: 11,
    title: "Уровень 11/12",
    task: "Какой самый частый смайлик в твоих сообщениях?",
    keySymbol: "6",
    options: [
      { id: "a", text: "🚀", isCorrect: true },
      { id: "b", text: "🤡", isCorrect: false },
      { id: "c", text: "🔥", isCorrect: false },
      { id: "d", text: "🫠", isCorrect: false },
    ],
  },
  {
    id: 12,
    title: "Уровень 12/12",
    task: "Готов увидеть ключ и забрать подарок?",
    keySymbol: "!",
    options: [
      { id: "a", text: "Да!", isCorrect: true },
      { id: "b", text: "Конечно!", isCorrect: true },
      { id: "c", text: "Уже жду", isCorrect: true },
      { id: "d", text: "Погнали", isCorrect: true },
    ],
  },
];
