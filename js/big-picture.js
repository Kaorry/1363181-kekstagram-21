'use strict';

(function () {
  const COMMENTS_ON_PAGE = 5;

  let commentsOffset = 0;
  let currentPhoto;

  const htmlELements = (() => {
    const main = document.querySelector(`.big-picture`);

    return {
      main,
      img: main.querySelector(`.big-picture__img`).querySelector(`img`),
      likesCount: main.querySelector(`.likes-count`),
      commentCounter: main.querySelector(`.social__comment-count`),
      commentsCount: main.querySelector(`.comments-count`),
      shownCommentsCount: main.querySelector(`.shown-comments-count`),
      commentLoader: main.querySelector(`.comments-loader`),
      commentList: main.querySelector(`.social__comments`),
      caption: main.querySelector(`.social__caption`),
      templateCommentItem: main.querySelector(`.social__comment`).cloneNode(true),
      cancelButton: main.querySelector(`.big-picture__cancel`),
    };
  })();

  const onEsc = window.util.createEscapeHandler((event) => {
    hide();
    event.preventDefault();
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

  const renderCommentList = () => {
    const fragment = document.createDocumentFragment();
    const shownList = currentPhoto.comments.slice(commentsOffset, commentsOffset + COMMENTS_ON_PAGE);

    for (const comment of shownList) {
      fragment.appendChild(renderCommentItem(comment));
    }

    htmlELements.commentList.appendChild(fragment);
    commentsOffset += shownList.length;
    htmlELements.shownCommentsCount.textContent = commentsOffset;

    if (commentsOffset === currentPhoto.comments.length) {
      htmlELements.commentLoader.classList.add(`hidden`);
    }
  };

  const renderCurrentPhoto = () => {
    htmlELements.img.src = currentPhoto.url;
    htmlELements.likesCount.textContent = currentPhoto.likes;
    htmlELements.commentsCount.textContent = currentPhoto.comments.length;
    htmlELements.caption.textContent = currentPhoto.description;
    htmlELements.commentList.innerHTML = ``;
    htmlELements.commentLoader.classList.remove(`hidden`);
    renderCommentList();
  };

  const show = (photo) => {
    currentPhoto = photo;

    commentsOffset = 0;
    renderCurrentPhoto();

    document.body.classList.add(`modal-open`);
    htmlELements.main.classList.remove(`hidden`);

    htmlELements.commentLoader.addEventListener(`click`, renderCommentList);

    htmlELements.cancelButton.addEventListener(`click`, hide);
    document.addEventListener(`keydown`, onEsc);
  };

  const hide = () => {
    currentPhoto = undefined;

    document.body.classList.remove(`modal-open`);
    htmlELements.main.classList.add(`hidden`);

    htmlELements.commentLoader.removeEventListener(`click`, renderCommentList);

    htmlELements.cancelButton.removeEventListener(`click`, hide);
    document.removeEventListener(`keydown`, onEsc);
  };

  window.bigPicture = {
    show,
    hide,
  };
})();
