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

let onCancelKeyPress;
const cancelKeyHandlerType = {
  bigPicture: `bigPicture`,
  editor: `editor`,
};

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
    cancelButton: main.querySelector(`.big-picture__cancel`),
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
  id,
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
  photoElement.dataset.id = photo.id;

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

  bigPicture.cancelButton.addEventListener(`click`, hideBigPicture);
  onCancelKeyPress = createCancelKeyHandler(cancelKeyHandlerType.bigPicture);
  document.addEventListener(`keydown`, onCancelKeyPress);
};

const hideBigPicture = () => {
  document.body.classList.remove(`modal-open`);
  bigPicture.main.classList.add(`hidden`);

  bigPicture.cancelButton.removeEventListener(`click`, hideBigPicture);
  document.removeEventListener(`keydown`, onCancelKeyPress);
  onCancelKeyPress = undefined;
};

const createCancelKeyHandler = (type) => {
  if (type === cancelKeyHandlerType.bigPicture) {
    return (event) => {
      if (
        event.key === KEY_ESCAPE
      ) {
        event.preventDefault();
        hideBigPicture();
      }
    };
  }

  if (type === cancelKeyHandlerType.editor) {
    return (event) => {
      if (
        event.key === KEY_ESCAPE &&
        !event.target.matches(`input[type="text"], textarea`)
      ) {
        event.preventDefault();
        closeModalEditor();
      }
    };
  }

  return undefined;
};

const getPhotoItemByID = (id) => photoList.find((photoItem) => photoItem.id === id);

const photoList = generatePhotoList(PHOTOS_NUMBER);
pictures.appendChild(renderPhotoList(photoList));

pictures.addEventListener(`click`, (event) => {
  if (event.target.matches(`*[class^="picture"]`)) {
    event.preventDefault();
    const id = parseInt(
        event.target.dataset.id || event.target.closest(`.picture`).dataset.id,
        10
    );
    showBigPicture(getPhotoItemByID(id));
  }
});

// новое задание

const KEY_ESCAPE = `Escape`;
const DEFAULT_EFFECT_INTENSITY = 20;
const DEFAULT_SCALE_VALUE = 100;
const DEFAULT_EFFECT = `none`;
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

const hashtagInput = imgUploadOverlay.querySelector(`.text__hashtags`);
const descriptionInput = imgUploadOverlay.querySelector(`.text__description`);

const effects = {
  none: () => ``,
  chrome: (intensity) => `grayscale(${intensity / 100})`,
  sepia: (intensity) => `sepia(${intensity / 100})`,
  marvin: (intensity) => `invert(${intensity}%)`,
  phobos: (intensity) => `blur(${intensity * 3 / 100}px)`,
  heat: (intensity) => `brightness(${(intensity * 2 / 100) + 1})`,
};

let currentScaleValue = DEFAULT_SCALE_VALUE;
let currentEffect = DEFAULT_EFFECT;

const between = (value, min, max) => Math.min(max, Math.max(min, value));

const resetEditorForm = () => {
  currentScaleValue = DEFAULT_SCALE_VALUE;
  currentEffect = DEFAULT_EFFECT;

  applyEffect(currentEffect, DEFAULT_EFFECT_INTENSITY);
  applyScale(currentScaleValue);

  hashtagInput.value = ``;
  descriptionInput.value = ``;
  imgUploadInput.value = ``;

  hashtagInput.setCustomValidity(``);
  hashtagInput.style.borderColor = `transparent`;
};

const openModalEditor = () => {
  resetEditorForm();

  imgUploadOverlay.classList.remove(`hidden`);
  document.body.classList.add(`modal-open`);

  imgUploadCancel.addEventListener(`click`, closeModalEditor);
  onCancelKeyPress = createCancelKeyHandler(cancelKeyHandlerType.editor);
  document.addEventListener(`keydown`, onCancelKeyPress);
};

const closeModalEditor = () => {
  resetEditorForm();

  imgUploadOverlay.classList.add(`hidden`);
  document.body.classList.remove(`modal-open`);

  imgUploadCancel.removeEventListener(`click`, closeModalEditor);
  document.removeEventListener(`keydown`, onCancelKeyPress);
  onCancelKeyPress = undefined;
};

const onEffectsRadioListChange = (event) => {
  currentEffect = event.target.value;

  if (currentEffect === `none`) {
    imgUploadEffectLevel.classList.add(`hidden`);
  } else {
    imgUploadEffectLevel.classList.remove(`hidden`);
  }

  applyEffect(currentEffect, DEFAULT_EFFECT_INTENSITY);
};

const applyEffect = (effect, intensity) => {
  imageForChange.className = `effects__preview--${effect}`;
  imageForChange.style.filter = effects[effect](intensity);

  if (effect === `none`) {
    imgUploadEffectLevel.classList.add(`hidden`);
  } else {
    imgUploadEffectLevel.classList.remove(`hidden`);
    const width = effectLevelLine.offsetWidth;
    const left = intensity * width / 100;
    effectLevelPin.style.left = `${left}px`;
    effectLevelDepth.style.width = `${left}px`;
  }
  effectLevelValue.value = intensity;
};

const changeScale = (direction) => {
  const newScaleValue = currentScaleValue + STEP_SCALE_VALUE * direction;
  currentScaleValue = between(newScaleValue, 25, 100);
  applyScale(currentScaleValue);
};

const applyScale = (scale) => {
  scaleControlValue.value = `${scale}%`;
  imageForChange.style.transform = `scale(${scale / 100})`;
};

const validateHashtag = (hashtagValue) => {
  const value = hashtagValue.trim().toLowerCase();

  if (value.length === 0) {
    return ``;
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

  return ``;
};

imgUploadInput.addEventListener(`change`, openModalEditor);

effectLevelLine.addEventListener(`mouseup`, (event) => {
  event.preventDefault();

  const rect = effectLevelLine.getBoundingClientRect();
  const left = event.clientX - rect.left;
  const intensity = left * 100 / rect.width;
  applyEffect(currentEffect, intensity);
});

imgUploadEffects.addEventListener(`change`, onEffectsRadioListChange);

scaleControlSmaller.addEventListener(`click`, () => changeScale(-1));
scaleControlBigger.addEventListener(`click`, () => changeScale(1));

hashtagInput.addEventListener(`input`, () => {
  const validateResult = validateHashtag(hashtagInput.value);
  hashtagInput.setCustomValidity(validateResult);
  hashtagInput.style.borderColor = validateResult ? `red` : `transparent`;
});
