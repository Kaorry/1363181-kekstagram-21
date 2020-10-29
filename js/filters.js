'use strict';

(function () {
  const RANDOM_PHOTO_AMOUNT = 10;
  const DEBOUNCE_INTERVAL = 500;

  const imageFilterList = document.querySelector(`.img-filters`);
  const imageFilterForm = imageFilterList.querySelector(`.img-filters__form`);

  const Filters = {
    default: `filter-default`,
    random: `filter-random`,
    discussed: `filter-discussed`,
  };

  let currentFilter = imageFilterList.querySelector(`.img-filters__button--active`);
  let changeHandler;

  const onFilterChange = (event) => {
    if (currentFilter !== event.target && event.target.classList.contains(`img-filters__button`)) {
      currentFilter.classList.remove(`img-filters__button--active`);
      currentFilter = event.target;
      currentFilter.classList.add(`img-filters__button--active`);

      triggerChange();
    }
  };

  const show = () => {
    imageFilterList.classList.remove(`img-filters--inactive`);
    imageFilterForm.addEventListener(`click`, onFilterChange);

    triggerChange();
  };

  const setChangeHandler = (handler) => {
    changeHandler = handler;
  };

  const applyFilter = (photoList) => {
    switch (currentFilter.id) {
      case Filters.random: {
        return photoList
          .sort(() => Math.random() - 0.5)
          .slice(0, RANDOM_PHOTO_AMOUNT);
      }

      case Filters.discussed: {
        return [...photoList]
          .sort((left, right) => right.comments.length - left.comments.length);
      }

      default:
        return photoList;
    }
  };

  const triggerChange = window.util.debounce(
      () => {
        if (changeHandler) {
          changeHandler();
        }
      },
      DEBOUNCE_INTERVAL
  );

  window.filters = {
    show,
    setChangeHandler,
    applyFilter,
  };
})();
