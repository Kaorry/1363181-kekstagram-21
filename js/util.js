'use strict';

(function () {
  const KEY_ESCAPE = `Escape`;

  const createCancelKeyHandler = (fn) => {
    return function (event) {
      if (event.key === KEY_ESCAPE && fn(event.target)) {
        event.preventDefault();
      }
    };
  };

  const between = (value, min, max) => Math.min(max, Math.max(min, value));

  const debounce = (cb, interval) => {
    let lastTimeout = null;

    return (...parameters) => {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(() => {
        cb(...parameters);
      }, interval);
    };
  };

  window.util = {
    createCancelKeyHandler,
    between,
    debounce,
  };
})();
