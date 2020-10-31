'use strict';

const KEY_ESCAPE = `Escape`;

const createEscapeHandler = (handler) => {
  return function (event) {
    if (event.key === KEY_ESCAPE) {
      handler(event);
    }
  };
};

const between = (value, min, max) => Math.min(max, Math.max(min, value));

const debounce = (callback, interval) => {
  let lastTimeout = null;

  return (...parameters) => {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(() => {
      callback(...parameters);
    }, interval);
  };
};

window.util = {
  createEscapeHandler,
  between,
  debounce,
};
