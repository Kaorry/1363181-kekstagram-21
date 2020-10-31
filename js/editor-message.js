'use strict';

const mainElement = document.querySelector(`main`);
const templateSuccessMessage = document.querySelector(`#success`).content.querySelector(`.success`);
const templateErrorMessage = document.querySelector(`#error`).content.querySelector(`.error`);

const showSuccessMessage = () => {
  const successMessage = templateSuccessMessage.cloneNode(true);
  const successButton = successMessage.querySelector(`.success__button`);

  const onEsc = window.util.createEscapeHandler(() => {
    hide();
    return true;
  });

  const onClick = (event) => {
    if (event.target === successMessage) {
      event.preventDefault();
      hide();
    }
  };

  const hide = () => {
    document.removeEventListener(`keydown`, onEsc);
    successMessage.removeEventListener(`click`, onClick);
    successButton.removeEventListener(`click`, hide);
    successMessage.remove();
  };

  mainElement.appendChild(successMessage);
  document.addEventListener(`keydown`, onEsc);
  successMessage.addEventListener(`click`, onClick);
  successButton.addEventListener(`click`, hide);
};

const showErrorMessage = () => {
  const errorMessage = templateErrorMessage.cloneNode(true);
  const errorButton = errorMessage.querySelector(`.error__button`);

  const onEsc = window.util.createEscapeHandler((event) => {
    hide();
    event.preventDefault();
  });

  const onClick = (event) => {
    if (event.target === errorMessage) {
      event.preventDefault();
      hide();
    }
  };

  const hide = () => {
    document.removeEventListener(`keydown`, onEsc);
    errorMessage.removeEventListener(`click`, onClick);
    errorButton.removeEventListener(`click`, hide);
    errorMessage.remove();
  };

  mainElement.appendChild(errorMessage);
  document.addEventListener(`keydown`, onEsc);
  errorMessage.addEventListener(`click`, onClick);
  errorButton.addEventListener(`click`, hide);
};

window.editorMessage = {
  showSuccessMessage,
  showErrorMessage,
};
