'use strict';

(function () {
  const BASE_URL = `https://21.javascript.pages.academy/kekstagram`;
  const LOAD_DATA_URL = `${BASE_URL}/data`;
  const UPLOAD_DATA_URL = `${BASE_URL}`;

  const Endpoints = {
    load: {
      url: LOAD_DATA_URL,
      method: `GET`,
    },
    upload: {
      url: UPLOAD_DATA_URL,
      method: `POST`,
    },
  };

  const StatusCode = {
    OK: 200
  };

  const TIMEOUT_IN_MS = 10000;

  const createXHR = (endpoint, onSuccess, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.open(endpoint.method, endpoint.url);

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

    return xhr;
  };

  const load = (onSuccess, onError) => {
    const xhr = createXHR(Endpoints.load, onSuccess, onError);
    xhr.send();
  };

  const upload = (data, onSuccess, onError) => {
    const xhr = createXHR(Endpoints.upload, onSuccess, onError);
    xhr.send(data);
  };

  window.api = {
    load,
    upload,
  };
})();
