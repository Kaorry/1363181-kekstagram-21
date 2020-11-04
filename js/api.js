'use strict';

const BASE_URL = `https://21.javascript.pages.academy/kekstagram`;
const LOAD_DATA_URL = `${BASE_URL}/data`;
const UPLOAD_DATA_URL = `${BASE_URL}`;

const StatusCode = {
  OK: 200
};

const Method = {
  GET: `GET`,
  POST: `POST`,
};

const TIMEOUT_IN_MS = 10000;

const createXHR = (onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

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
  const xhr = createXHR(onSuccess, onError);
  xhr.open(Method.GET, LOAD_DATA_URL);
  xhr.send();
};

const upload = (data, onSuccess, onError) => {
  const xhr = createXHR(onSuccess, onError);
  xhr.open(Method.POST, UPLOAD_DATA_URL);
  xhr.send(data);
};

window.api = {
  load,
  upload,
};
