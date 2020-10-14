'use strict';

(function () {
  const PHOTOS_NUMBER = 25;
  const AVATAR_NUMBER = 6;
  const MIN_LIKES = 15;
  const MAX_LIKES = 200;
  const MIN_COMMENTS = 5;
  const MAX_COMMENTS = 20;

  const KEY_ESCAPE = `Escape`;
  const DEFAULT_EFFECT_INTENSITY = 20;
  const DEFAULT_SCALE_VALUE = 100;
  const DEFAULT_EFFECT = `none`;
  const STEP_SCALE_VALUE = 25;
  const HASHTAG_AMOUNT = 5;
  const HASHTAG_RULE = /^#[\wа-яё]{1,19}$/;

  const USER_NAMES = [
    `Алиса`,
    `Мурзик`,
    `Леголас95`,
    `Горра`,
    `DimOn`,
    `Wind`,
    `Андрей`,
    `Космос`,
    `Бьянка`,
    `Mister_X`
  ];
  const MESSAGES = [
    `Всё отлично!`,
    `В целом всё неплохо. Но не всё.`,
    `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
    `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
    `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
    `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`
  ];
  const DESCRIPTIONS = [
    `Тестим новую камеру! =)`,
    `Фото с нашего отдыха`,
    `Прикольно получилось`
  ];

  window.const = {
    PHOTOS_NUMBER,
    AVATAR_NUMBER,
    MIN_LIKES,
    MAX_LIKES,
    MIN_COMMENTS,
    MAX_COMMENTS,
    KEY_ESCAPE,
    DEFAULT_EFFECT_INTENSITY,
    DEFAULT_SCALE_VALUE,
    DEFAULT_EFFECT,
    STEP_SCALE_VALUE,
    HASHTAG_AMOUNT,
    HASHTAG_RULE,
    USER_NAMES,
    MESSAGES,
    DESCRIPTIONS,
  };
})();
