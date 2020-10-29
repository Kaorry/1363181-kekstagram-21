'use strict';

(function () {
  const templatePhotoItem = document.querySelector(`#picture`).content.querySelector(`.picture`);

  const renderPhotoItem = (photo) => {
    const photoElement = templatePhotoItem.cloneNode(true);

    photoElement.querySelector(`.picture__img`).src = photo.url;
    photoElement.querySelector(`.picture__likes`).textContent = photo.likes;
    photoElement.querySelector(`.picture__comments`).textContent = photo.comments.length;
    photoElement.dataset.id = photo.id;

    return photoElement;
  };

  const render = (photoList) => {
    const fragment = document.createDocumentFragment();
    for (const photo of photoList) {
      fragment.appendChild(renderPhotoItem(photo));
    }

    return fragment;
  };

  const clear = () => {
    const oldPictures = document.querySelectorAll(`.picture`);
    oldPictures.forEach((element) => {
      element.remove();
    });
  };

  window.photoList = {
    render,
    clear,
  };
})();
