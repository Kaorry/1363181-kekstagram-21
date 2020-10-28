'use strict';

const pictures = document.querySelector(`.pictures`);

window.api.load(
    (data) => {
      window.data.setPhotoList(data);

      window.filters.setChangeHandler(() => {
        const photoList = window.data.getPhotoList();
        const filteredPhotoList = window.filters.applyFilter(photoList);
        const oldPictures = document.querySelectorAll(`.picture`);
        oldPictures.forEach((element) => {
          element.remove();
        });

        pictures.appendChild(window.photoList.render(filteredPhotoList));
      });

      window.filters.show();

      pictures.addEventListener(
          `click`,
          (event) => {
            if (event.target.matches(`*[class^="picture"]`)) {
              event.preventDefault();
              const id = parseInt(
                  event.target.dataset.id || event.target.closest(`.picture`).dataset.id,
                  10
              );
              const pictureItem = window.data.getPhotoItemByID(id);
              window.bigPicture.show(pictureItem);
            }
          }
      );
    },
    (error) => {
      const node = document.createElement(`div`);

      node.style.zIndex = 100;
      node.style.margin = `0 auto`;
      node.style.lineHeight = `60px`;
      node.style.textAlign = `center`;
      node.style.backgroundColor = `red`;
      node.style.position = `absolute`;
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = `30px`;

      node.textContent = error;
      document.body.insertAdjacentElement(`afterbegin`, node);
    }
);
