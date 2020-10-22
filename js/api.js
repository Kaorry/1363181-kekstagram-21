'use strict';

(function () {
  const BASE_URL = `https://21.javascript.pages.academy/kekstagram`;
  const LOAD_DATA_URL = `${BASE_URL}/data`;
  const UPLOAD_DATA_URL = `${BASE_URL}`;
  const StatusCode = {
    OK: 200
  };

  const TIMEOUT_IN_MS = 10000;

  const send = (url, method, onSuccess, onError, data = undefined) => {
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

    xhr.send(data);
  };

  const load = (onSuccess, onError) => send(LOAD_DATA_URL, `GET`, onSuccess, onError);
  const upload = (data, onResult) => {
    return send(
        UPLOAD_DATA_URL,
        `POST`,
        () => onResult(true),
        () => onResult(false),
        data
    );
  };

  window.api = {
    load,
    upload,
  };
})();
