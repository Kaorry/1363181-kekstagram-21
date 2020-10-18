'use strict';

(function () {
  const URL = `https://21.javascript.pages.academy/kekstagram/data`;

  const loadData = (onSuccess) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.open(`GET`, URL);

    const onSuccessLoad = () => onSuccess(xhr.response);
    xhr.addEventListener(`load`, onSuccessLoad);

    xhr.send();
  };

  window.api = {
    loadData,
  };
})();
