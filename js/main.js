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
  if (!photo) {
    return;
  }

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

showBigPicture();

// новое задание

const KEY_ESCAPE = `Escape`;
const DEFAULT_EFFECT_INTENSITY = 20;
const STEP_SCALE_VALUE = 25;
const HASHTAG_AMOUNT = 5;
const HASHTAG_RULE = /^#[\wа-яё]{1,19}$/;

const imgUploadInput = document.querySelector(`.img-upload__input`);
const imgUploadOverlay = document.querySelector(`.img-upload__overlay`);
const imgUploadCancel = document.querySelector(`.img-upload__cancel`);
const imgUploadEffects = document.querySelector(`.img-upload__effects`);

const imageUploadPreview = imgUploadOverlay.querySelector(`.img-upload__preview`);
const imageForChange = imageUploadPreview.querySelector(`img`);
const imgUploadEffectLevel = imgUploadOverlay.querySelector(`.img-upload__effect-level`);
const effectLevelLine = imgUploadOverlay.querySelector(`.effect-level__line`);
const effectLevelPin = imgUploadOverlay.querySelector(`.effect-level__pin`);
const effectLevelDepth = imgUploadOverlay.querySelector(`.effect-level__depth`);
const effectLevelValue = imgUploadOverlay.querySelector(`.effect-level__value`);

const scaleControlSmaller = imgUploadOverlay.querySelector(`.scale__control--smaller`);
const scaleControlBigger = imgUploadOverlay.querySelector(`.scale__control--bigger`);
const scaleControlValue = imgUploadOverlay.querySelector(`.scale__control--value`);

const effects = {
  none: () => ``,
  chrome: (intensity) => `grayscale(${intensity / 100})`,
  sepia: (intensity) => `sepia(${intensity / 100})`,
  marvin: (intensity) => `invert(${intensity}%)`,
  phobos: (intensity) => `blur(${intensity * 3 / 100}px)`,
  heat: (intensity) => `brightness(${(intensity * 2 / 100) + 1})`,
};

let currentScaleValue = 100;
let currentEffect = `none`;
let currentEffectIntensity = DEFAULT_EFFECT_INTENSITY;

const onCancelKeyPress = (event) => {
  if (event.key === KEY_ESCAPE && !event.target.matches(`input[type="text"]`)) {
    event.preventDefault();
    closeModalEditor();
  }
};

const openModalEditor = () => {
  imgUploadOverlay.classList.remove(`hidden`);
  document.body.classList.add(`modal-open`);

  document.addEventListener(`keydown`, onCancelKeyPress);
};

const closeModalEditor = () => {
  imgUploadOverlay.classList.add(`hidden`);
  document.body.classList.remove(`modal-open`);

  document.removeEventListener(`keydown`, onCancelKeyPress);
};

const onEffectsRadioListChange = (event) => {
  imageUploadPreview.classList.remove(`effects__preview--${currentEffect}`);
  currentEffect = event.target.value;
  currentEffectIntensity = DEFAULT_EFFECT_INTENSITY;

  if (currentEffect === `none`) {
    imgUploadEffectLevel.classList.add(`hidden`);
  } else {
    imgUploadEffectLevel.classList.remove(`hidden`);
  }

  applyCurrentEffect();
};

const applyCurrentEffect = () => {
  imageUploadPreview.classList.add(`effects__preview--${currentEffect}`);
  imageUploadPreview.style.filter = effects[currentEffect](currentEffectIntensity);

  const rect = effectLevelLine.getBoundingClientRect();
  const left = currentEffectIntensity * rect.width / 100;
  effectLevelPin.style.left = `${left}px`;
  effectLevelDepth.style.width = `${left}px`;
  effectLevelValue.value = currentEffectIntensity;
};

const changeScale = (direction) => {
  currentScaleValue = Math.min(
      100,
      Math.max(
          25,
          currentScaleValue + STEP_SCALE_VALUE * (direction > 0 ? 1 : -1)
      )
  );
  scaleControlValue.value = `${currentScaleValue}%`;
  imageForChange.style.transform = `scale(${currentScaleValue / 100})`;
};

const validateHashtag = (hashtagValue) => {
  const value = hashtagValue.trim().toLowerCase();

  if (value.length === 0) {
    return true;
  }

  const hashtagList = value.split(/\s+/);

  const hashtagSet = new Set(hashtagList);
  if (hashtagList.length !== hashtagSet.size) {
    return `Хэш-теги не должны повторяться`;
  }

  if (hashtagList.length > HASHTAG_AMOUNT) {
    return `Количество хэш-тегов не больше ${HASHTAG_AMOUNT}`;
  }

  for (let hashtag of hashtagList) {
    if (HASHTAG_RULE.test(hashtag) === false) {
      return `Неверный формат хэш-тега "${hashtag}"`;
    }
  }

  return true;
};

imgUploadInput.addEventListener(`change`, openModalEditor);
imgUploadCancel.addEventListener(`click`, closeModalEditor);

effectLevelLine.addEventListener(`mouseup`, (event) => {
  event.preventDefault();

  const rect = effectLevelLine.getBoundingClientRect();
  const left = event.clientX - rect.left;
  currentEffectIntensity = left * 100 / rect.width;
  applyCurrentEffect();
});

imgUploadEffectLevel.classList.add(`hidden`);
imgUploadEffects.addEventListener(`change`, onEffectsRadioListChange);

scaleControlValue.value = `${currentScaleValue}%`;
imageForChange.style.transform = `scale(${currentScaleValue / 100})`;
scaleControlSmaller.addEventListener(`click`, () => changeScale(-1));
scaleControlBigger.addEventListener(`click`, () => changeScale(1));

const hashtagInput = imgUploadOverlay.querySelector(`.text__hashtags`);

hashtagInput.addEventListener(`input`, () => {
  const validateResult = validateHashtag(hashtagInput.value);
  if (validateResult === true) {
    hashtagInput.setCustomValidity(``);
    hashtagInput.style.borderColor = `transparent`;
  } else {
    // todo Не всплывают сообщения с ошибками
    hashtagInput.setCustomValidity(validateResult);
    hashtagInput.style.borderColor = `red`;
  }
});
