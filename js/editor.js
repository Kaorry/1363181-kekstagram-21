'use strict';

const HASHTAG_AMOUNT = 5;
const HASHTAG_RULE = /^#[\wа-яё]{1,19}$/;
const HASHTAG_SPLIT_RULE = /\s+/;

const imgUploadForm = document.querySelector(`.img-upload__form`);
const imgUploadInput = document.querySelector(`.img-upload__input`);
const imgUploadOverlay = document.querySelector(`.img-upload__overlay`);
const imgUploadCancel = document.querySelector(`.img-upload__cancel`);
const imgUploudPreview = document.querySelector(`.img-upload__preview img`);

const hashtagInput = imgUploadOverlay.querySelector(`.text__hashtags`);
const descriptionInput = imgUploadOverlay.querySelector(`.text__description`);

const onEditorEsc = window.util.createEscapeHandler((event) => {
  if (!event.target.matches(`input[type="text"], textarea`)) {
    hide();
    event.preventDefault();
  }

  return false;
});

const onHashtagInput = () => {
  const validateResult = validateHashtag(hashtagInput.value);
  hashtagInput.setCustomValidity(validateResult);
  hashtagInput.style.borderColor = validateResult ? `red` : `transparent`;
};

const onSubmitUserData = (event) => {
  event.preventDefault();
  window.api.upload(
      new FormData(imgUploadForm),
      () => {
        window.editorMessage.showSuccessMessage();
        imgUploadOverlay.classList.add(`hidden`);
        resetEditorForm();
        imgUploadInput.value = ``;
      },
      () => {
        window.editorMessage.showErrorMessage();
        imgUploadOverlay.classList.add(`hidden`);
        resetEditorForm();
        imgUploadInput.value = ``;
      }
  );
};

const resetEditorForm = () => {
  window.editorEffect.reset();
  hashtagInput.value = ``;
  descriptionInput.value = ``;

  hashtagInput.setCustomValidity(``);
  hashtagInput.style.borderColor = `transparent`;
};

const loadImage = (file) => {
  const reader = new FileReader();

  reader.addEventListener(
      `load`,
      () => {
        imgUploudPreview.src = reader.result;
      },
      {once: true}
  );

  reader.readAsDataURL(file);
};

const show = () => {
  resetEditorForm();
  window.editorEffect.enable();

  imgUploadOverlay.classList.remove(`hidden`);
  document.body.classList.add(`modal-open`);

  imgUploadCancel.addEventListener(`click`, hide);
  document.addEventListener(`keydown`, onEditorEsc);
  hashtagInput.addEventListener(`input`, onHashtagInput);
  imgUploadForm.addEventListener(`submit`, onSubmitUserData);

  loadImage(imgUploadInput.files[0]);
};

const hide = () => {
  resetEditorForm();
  window.editorEffect.disable();
  imgUploadInput.value = ``;

  imgUploadOverlay.classList.add(`hidden`);
  document.body.classList.remove(`modal-open`);

  imgUploadCancel.removeEventListener(`click`, hide);
  document.removeEventListener(`keydown`, onEditorEsc);
  hashtagInput.removeEventListener(`input`, onHashtagInput);
  imgUploadForm.removeEventListener(`submit`, onSubmitUserData);
};

const validateHashtag = (hashtagValue) => {
  const value = hashtagValue.trim().toLowerCase();

  if (value.length === 0) {
    return ``;
  }

  const hashtagList = value.split(HASHTAG_SPLIT_RULE);

  const hashtagSet = new Set(hashtagList);
  if (hashtagList.length !== hashtagSet.size) {
    return `Хэш-теги не должны повторяться`;
  }

  if (hashtagList.length > HASHTAG_AMOUNT) {
    return `Количество хэш-тегов не больше ${HASHTAG_AMOUNT}`;
  }

  for (let hashtag of hashtagList) {
    if (!HASHTAG_RULE.test(hashtag)) {
      return `Неверный формат хэш-тега "${hashtag}"`;
    }
  }

  return ``;
};

imgUploadInput.addEventListener(`change`, show);

window.editor = {
  show,
  hide,
};
