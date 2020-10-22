'use strict';

(function () {
  const HASHTAG_AMOUNT = 5;
  const HASHTAG_RULE = /^#[\wа-яё]{1,19}$/;

  const mainElement = document.querySelector(`main`);

  const imgUploadForm = document.querySelector(`.img-upload__form`);
  const imgUploadInput = document.querySelector(`.img-upload__input`);
  const imgUploadOverlay = document.querySelector(`.img-upload__overlay`);
  const imgUploadCancel = document.querySelector(`.img-upload__cancel`);

  const hashtagInput = imgUploadOverlay.querySelector(`.text__hashtags`);
  const descriptionInput = imgUploadOverlay.querySelector(`.text__description`);

  const templateSuccessMessage = document.querySelector(`#success`).content.querySelector(`.success`);
  const templateErrorMessage = document.querySelector(`#error`).content.querySelector(`.error`);

  let submitMessage;

  const onEditorEsc = window.util.createCancelKeyHandler((target) => {
    if (!target.matches(`input[type="text"], textarea`)) {
      hide();
      return true;
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
        (isSuccess) => {
          showSubmitMessage(isSuccess);
          imgUploadOverlay.classList.add(`hidden`);
          resetEditorForm();
          imgUploadInput.value = ``;
        }
    );
  };

  const onEsc = window.util.createCancelKeyHandler(() => {
    hideSubmitMessage();
    return true;
  });

  const onDocumentClick = (event) => {
    event.preventDefault();
    hideSubmitMessage();
  };

  const showSubmitMessage = (isSuccess) => {
    if (submitMessage) {
      hideSubmitMessage();
    }
    const template = isSuccess ? templateSuccessMessage : templateErrorMessage;
    submitMessage = template.cloneNode(true);
    mainElement.appendChild(submitMessage);
    document.addEventListener(`keydown`, onEsc);
    document.addEventListener(`click`, onDocumentClick);
  };

  const hideSubmitMessage = () => {
    submitMessage.remove();
    submitMessage = undefined;
    document.removeEventListener(`keydown`, onEsc);
    document.removeEventListener(`click`, onDocumentClick);
  };

  const resetEditorForm = () => {
    window.editorEffect.reset();
    hashtagInput.value = ``;
    descriptionInput.value = ``;

    hashtagInput.setCustomValidity(``);
    hashtagInput.style.borderColor = `transparent`;
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

  imgUploadInput.addEventListener(`change`, show);

  window.editor = {
    show,
    hide,
  };
})();
