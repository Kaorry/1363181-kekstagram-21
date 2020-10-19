'use strict';

(function () {
  const LOAD_DATA_URL = `https://21.javascript.pages.academy/kekstagram/data`;
  const StatusCode = {
    OK: 200
  };

  const TIMEOUT_IN_MS = 10000;

  const send = (url, method, onSuccess, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.open(method, url);

    const onLoadData = () => {
      let error;
      switch (xhr.status) {
        case StatusCode.OK:
          onSuccess(xhr.response);
          break;

        default:
          error = `Статус ответа: ${xhr.status} ${xhr.statusText}`;
      }
      if (error) {
        onError(error);
      }

    };

    xhr.addEventListener(
        `error`,
        () => onError(`Произошла ошибка соединения`)
    );
    xhr.addEventListener(
        `timeout`,
        () => onError(`Запрос не успел выполниться за ${xhr.timeout} мс`)
    );
    xhr.addEventListener(`load`, onLoadData);

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.send();
  };

  const loadData = (onSuccess, onError) => send(LOAD_DATA_URL, `GET`, onSuccess, onError);

  window.api = {
    loadData,
  };
})();
