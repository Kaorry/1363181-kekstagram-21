'use strict';

(function () {
  const PHOTOS_AMOUNT = 25;
  const AVATAR_AMOUNT = 6;
  const MIN_COMMENTS = 5;
  const MAX_COMMENTS = 20;
  const MIN_LIKES = 15;
  const MAX_LIKES = 200;

  const USER_NAMES = [
    `Алиса`,
    `Мурзик`,
    `Леголас95`,
    `Горра`,
    `DimOn`,
    `Wind`,
    `Андрей`,
    `Космос`,
    `Бьянка`,
    `Mister_X`
  ];
  const MESSAGES = [
    `Всё отлично!`,
    `В целом всё неплохо. Но не всё.`,
    `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
    `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
    `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
    `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`
  ];

  const DESCRIPTIONS = [
    `Тестим новую камеру! =)`,
    `Фото с нашего отдыха`,
    `Прикольно получилось`
  ];

  const getRandomAvatar = () => `img/avatar-${window.util.getRandom(1, AVATAR_AMOUNT)}.svg`;

  const getRandomMessage = () => window.util.generateArray(
      window.util.getRandom(1, 2),
      () => window.util.getRandomItem(MESSAGES)
  ).join(` `);

  const generateCommentItem = () => ({
    avatar: getRandomAvatar(),
    message: getRandomMessage(),
    name: window.util.getRandomItem(USER_NAMES),
  });

  const generateCommentList = () => window.util.generateArray(
      window.util.getRandom(MIN_COMMENTS, MAX_COMMENTS),
      generateCommentItem
  );

  const generatePhotoItem = (id) => ({
    id,
    url: `photos/${id}.jpg`,
    description: window.util.getRandomItem(DESCRIPTIONS),
    likes: window.util.getRandom(MIN_LIKES, MAX_LIKES),
    comments: generateCommentList(),
  });

  const generatePhotoList = (max) => window.util.generateArray(
      max,
      (_, index) => generatePhotoItem(index + 1)
  );

  const photoList = generatePhotoList(PHOTOS_AMOUNT);

  const getPhotoItemByID = (id) => photoList.find((photoItem) => photoItem.id === id);

  window.data = {
    photoList,
    getPhotoItemByID,
  };
})();
