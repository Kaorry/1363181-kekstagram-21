'use strict';

const ErrorStyles = {
  zIndex: 100,
  margin: `0 auto`,
  lineHeight: `60px`,
  textAlign: `center`,
  backgroundColor: `red`,
  position: `absolute`,
  left: 0,
  right: 0,
  fontSize: `30px`,
};
const pictures = document.querySelector(`.pictures`);

window.api.load(
    (data) => {
      window.data.setPhotoList(data);

      window.filters.setChangeHandler(() => {
        const photoList = window.data.getPhotoList();
        const filteredPhotoList = window.filters.applyFilter(photoList);
        window.photoList.clear();

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

      node.style = ErrorStyles;

      node.textContent = error;
      document.body.insertAdjacentElement(`afterbegin`, node);
    }
);
