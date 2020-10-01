'use strict';

const PHOTOS_NUMBER = 25;
const AVATAR_NUMBER = 6;
const MIN_LIKES = 15;
const MAX_LIKES = 200;
const MIN_COMMENTS = 5;
const MAX_COMMENTS = 20;

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

const pictures = document.querySelector(`.pictures`);
const templatePhotoItem = document.querySelector(`#picture`).content.querySelector(`.picture`);

const bigPicture = (() => {
  const main = document.querySelector(`.big-picture`);

  return {
    main,
    img: main.querySelector(`.big-picture__img`).querySelector(`img`),
    likesCount: main.querySelector(`.likes-count`),
    commentCounter: main.querySelector(`.social__comment-count`),
    commentsCount: main.querySelector(`.comments-count`),
    commentLoader: main.querySelector(`.comments-loader`),
    commentList: main.querySelector(`.social__comments`),
    caption: main.querySelector(`.social__caption`),
    templateCommentItem: main.querySelector(`.social__comment`).cloneNode(true),
  };
})();

const getRandom = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const getRandomItem = (array) => array[getRandom(0, array.length - 1)];

const generateArray = (length, generatorItem) => [...Array(length)]
  .map(generatorItem);

const getRandomAvatar = () => `img/avatar-${getRandom(1, AVATAR_NUMBER)}.svg`;

const getRandomMessage = () => generateArray(
    getRandom(1, 2),
    () => getRandomItem(MESSAGES)
).join(` `);

const generateCommentItem = () => ({
  avatar: getRandomAvatar(),
  message: getRandomMessage(),
  name: getRandomItem(USER_NAMES),
});

const generateCommentList = () => generateArray(
    getRandom(MIN_COMMENTS, MAX_COMMENTS),
    generateCommentItem
);

const generatePhotoItem = (id) => ({
  url: `photos/${id}.jpg`,
  description: getRandomItem(DESCRIPTIONS),
  likes: getRandom(MIN_LIKES, MAX_LIKES),
  comments: generateCommentList(),
});

const generatePhotoList = (max) => generateArray(
    max,
    (_, index) => generatePhotoItem(index + 1)
);

const renderPhotoItem = (photo) => {
  const photoElement = templatePhotoItem.cloneNode(true);

  photoElement.querySelector(`.picture__img`).src = photo.url;
  photoElement.querySelector(`.picture__likes`).textContent = photo.likes;
  photoElement.querySelector(`.picture__comments`).textContent = photo.comments.length;

  return photoElement;
};

const renderPhotoList = (photoList) => {
  const fragment = document.createDocumentFragment();
  for (const photo of photoList) {
    fragment.appendChild(renderPhotoItem(photo));
  }

  return fragment;
};

const renderCommentItem = (comment) => {
  const commentElement = bigPicture.templateCommentItem.cloneNode(true);
  const pictureElement = commentElement.querySelector(`.social__picture`);
  const textElement = commentElement.querySelector(`.social__text`);

  pictureElement.src = comment.avatar;
  pictureElement.alt = comment.name;
  textElement.textContent = comment.message;

  return commentElement;
};

const showBigPicture = (photo) => {
  bigPicture.img.src = photo.url;
  bigPicture.likesCount.textContent = photo.likes;
  bigPicture.commentsCount.textContent = photo.comments.length;
  bigPicture.commentList.innerHTML = ``;

  const fragment = document.createDocumentFragment();
  for (const comment of photo.comments) {
    fragment.appendChild(renderCommentItem(comment));
  }
  bigPicture.commentList.appendChild(fragment);

  bigPicture.caption.textContent = photo.description;

  bigPicture.commentCounter.classList.add(`hidden`);
  bigPicture.commentLoader.classList.add(`hidden`);
  document.body.classList.add(`modal-open`);
  bigPicture.main.classList.remove(`hidden`);
};

const photoList = generatePhotoList(PHOTOS_NUMBER);
pictures.appendChild(renderPhotoList(photoList));

showBigPicture(photoList[0]);
