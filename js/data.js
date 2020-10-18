'use strict';

(function () {
  let photoList = [];

  const getPhotoItemByID = (id) => photoList.find((photoItem) => photoItem.id === id);

  const getPhotoList = () => photoList;
  const setPhotoList = (data) => {
    photoList = data.map((item, index) => {
      return Object.assign({id: index}, item);
    });
  };

  window.data = {
    getPhotoList,
    getPhotoItemByID,
    setPhotoList,
  };
})();
