'use strict';

(function () {
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
    document.addEventListener(`keydown`, onBigPictureEsc);
  };

  const hideBigPicture = () => {
    document.body.classList.remove(`modal-open`);
    bigPicture.main.classList.add(`hidden`);

    bigPicture.cancelButton.removeEventListener(`click`, hideBigPicture);
    document.removeEventListener(`keydown`, onBigPictureEsc);
  };

  const onBigPictureEsc = window.util.createCancelKeyHandler(() => {
    hideBigPicture();
    return true;
  });

  window.bigPicture = {
    showBigPicture,
    hideBigPicture,
  };
})();
