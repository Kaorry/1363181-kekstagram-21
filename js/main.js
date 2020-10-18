'use strict';

const pictures = document.querySelector(`.pictures`);

window.api.loadData((data) => {

  window.data.setPhotoList(data);

  pictures.appendChild(window.photoList.render(window.data.getPhotoList()));

  pictures.addEventListener(`click`, (event) => {
    if (event.target.matches(`*[class^="picture"]`)) {
      event.preventDefault();
      const id = parseInt(
          event.target.dataset.id || event.target.closest(`.picture`).dataset.id,
          10
      );
      const pictureItem = window.data.getPhotoItemByID(id);
      window.bigPicture.show(pictureItem);
    }
  });
});
