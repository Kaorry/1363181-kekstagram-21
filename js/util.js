'use strict';

(function () {
  const KEY_ESCAPE = `Escape`;

  const getRandom = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

  const getRandomItem = (array) => array[getRandom(0, array.length - 1)];

  const generateArray = (length, generatorItem) => [...Array(length)]
    .map(generatorItem);

  const createCancelKeyHandler = (fn) => {
    return function (event) {
      if (event.key === KEY_ESCAPE && fn(event.target)) {
        event.preventDefault();
      }
    };
  };

  const between = (value, min, max) => Math.min(max, Math.max(min, value));

  window.util = {
    getRandom,
    getRandomItem,
    generateArray,
    createCancelKeyHandler,
    between,
  };
})();
