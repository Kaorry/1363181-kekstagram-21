'use strict';

const PHOTOS_NUMBER = 25;
const AVATAR_NUMBER = 6;
const MIN_LIKES = 15;
const MAX_LIKES = 200;
const MIN_COMMENTS = 0;
const MAX_COMMENTS = 10;

const USER_NAMES = [`Алиса`, `Мурзик`, `Леголас95`, `Горра`, `DimOn`, `Wind`, `Андрей`, `Космос`, `Бьянка`, `Mister_X`];
const MESSAGES = [
  `Всё отлично!`,
  `В целом всё неплохо. Но не всё.`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`
];

//

const getRandom = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const getRandomItem = (array) => getRandom(0, array.length - 1);

const generateArray = (length, generateItem) => [...Array(length)]
  .map(generateItem);

const getRandomAvatar = () => `img/avatar-${getRandom(1, AVATAR_NUMBER)}.svg`;

const getRandomMessage = () => generateArray(
    getRandom(1, 2),
    () => getRandomItem(MESSAGES)
).join(` `);

const generateCommentItem = () => (
  {
    avatar: getRandomAvatar(),
    message: getRandomMessage(),
    name: getRandomItem(USER_NAMES),
  }
);

const generateCommentList = () => generateArray(
    getRandom(MIN_COMMENTS, MAX_COMMENTS),
    generateCommentItem
);

const generatePhotoItem = (id) => ({
  url: `photos/${id}.jpg`,
  description: ``,
  likes: getRandom(MIN_LIKES, MAX_LIKES),
  comments: generateCommentList(),
});

const generatePhotoList = (max) => {
  const photoList = [];
  for (let i = 1; i <= max; i++) {
    photoList.push(generatePhotoItem(i));
  }

  return photoList;
};

const renderPhotoItem = (photo) => {
  let photoElement = templatePhotoItem.cloneNode(true);

  photoElement.querySelector(`.picture__img`).src = photo.url;
  photoElement.querySelector(`.picture__likes`).textContent = photo.likes;
  photoElement.querySelector(`.picture__comments`).textContent = photo.comments.length;

  return photoElement;
};

const renderPhotoList = (photoList) => {
  const fragment = document.createDocumentFragment();
  for (let photo of photoList) {
    fragment.appendChild(renderPhotoItem(photo));
  }

  return fragment;
};

//

const pictures = document.querySelector(`.pictures`);
const templatePhotoItem = document.querySelector(`#picture`).content.querySelector(`.picture`);

const photoList = generatePhotoList(PHOTOS_NUMBER);

pictures.appendChild(renderPhotoList(photoList));
