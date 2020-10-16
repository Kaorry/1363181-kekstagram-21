'use strict';

(function () {
  const htmlELements = (() => {
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

  const onEsc = window.util.createCancelKeyHandler(() => {
    hide();
    return true;
  });

  const renderCommentItem = (comment) => {
    const commentElement = htmlELements.templateCommentItem.cloneNode(true);
    const pictureElement = commentElement.querySelector(`.social__picture`);
    const textElement = commentElement.querySelector(`.social__text`);

    pictureElement.src = comment.avatar;
    pictureElement.alt = comment.name;
    textElement.textContent = comment.message;

    return commentElement;
  };

  const show = (photo) => {
    if (!photo) {
      return;
    }

    htmlELements.img.src = photo.url;
    htmlELements.likesCount.textContent = photo.likes;
    htmlELements.commentsCount.textContent = photo.comments.length;
    htmlELements.commentList.innerHTML = ``;

    const fragment = document.createDocumentFragment();
    for (const comment of photo.comments) {
      fragment.appendChild(renderCommentItem(comment));
    }
    htmlELements.commentList.appendChild(fragment);

    htmlELements.caption.textContent = photo.description;

    htmlELements.commentCounter.classList.add(`hidden`);
    htmlELements.commentLoader.classList.add(`hidden`);
    document.body.classList.add(`modal-open`);
    htmlELements.main.classList.remove(`hidden`);

    htmlELements.cancelButton.addEventListener(`click`, hide);
    document.addEventListener(`keydown`, onEsc);
  };

  const hide = () => {
    document.body.classList.remove(`modal-open`);
    htmlELements.main.classList.add(`hidden`);

    htmlELements.cancelButton.removeEventListener(`click`, hide);
    document.removeEventListener(`keydown`, onEsc);
  };

  window.bigPicture = {
    show,
    hide,
  };
})();
