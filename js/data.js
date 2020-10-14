'use strict';

(function () {
  const getRandomAvatar = () => `img/avatar-${window.util.getRandom(1, window.const.AVATAR_NUMBER)}.svg`;

  const getRandomMessage = () => window.util.generateArray(
      window.util.getRandom(1, 2),
      () => window.util.getRandomItem(window.const.MESSAGES)
  ).join(` `);

  const generateCommentItem = () => ({
    avatar: getRandomAvatar(),
    message: getRandomMessage(),
    name: window.util.getRandomItem(window.const.USER_NAMES),
  });

  const generateCommentList = () => window.util.generateArray(
      window.util.getRandom(window.const.MIN_COMMENTS, window.const.MAX_COMMENTS),
      generateCommentItem
  );

  const generatePhotoItem = (id) => ({
    id,
    url: `photos/${id}.jpg`,
    description: window.util.getRandomItem(window.const.DESCRIPTIONS),
    likes: window.util.getRandom(window.const.MIN_LIKES, window.const.MAX_LIKES),
    comments: generateCommentList(),
  });

  const generatePhotoList = (max) => window.util.generateArray(
      max,
      (_, index) => generatePhotoItem(index + 1)
  );

  const photoList = generatePhotoList(window.const.PHOTOS_NUMBER);

  const getPhotoItemByID = (id) => photoList.find((photoItem) => photoItem.id === id);

  window.data = {
    photoList,
    getPhotoItemByID,
  };
})();
