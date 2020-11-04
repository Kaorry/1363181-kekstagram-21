'use strict';

const DEFAULT_EFFECT_INTENSITY = 100;
const DEFAULT_SCALE_VALUE = 100;
const DEFAULT_EFFECT = `none`;
const STEP_SCALE_VALUE = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;

const previewContainer = document.querySelector(`.img-upload__preview-container`);
const imageUploadEffects = document.querySelector(`.img-upload__effects`);

const imageUploadPreview = previewContainer.querySelector(`.img-upload__preview`);
const imageForChange = imageUploadPreview.querySelector(`img`);

const imageUploadEffectLevel = previewContainer.querySelector(`.img-upload__effect-level`);
const effectLevelLine = previewContainer.querySelector(`.effect-level__line`);
const effectLevelPin = previewContainer.querySelector(`.effect-level__pin`);
const effectLevelDepth = previewContainer.querySelector(`.effect-level__depth`);
const effectLevelValue = previewContainer.querySelector(`.effect-level__value`);

const scaleControlSmaller = previewContainer.querySelector(`.scale__control--smaller`);
const scaleControlBigger = previewContainer.querySelector(`.scale__control--bigger`);
const scaleControlValue = previewContainer.querySelector(`.scale__control--value`);

const effects = {
  none: () => ``,
  chrome: (intensity) => `grayscale(${intensity / 100})`,
  sepia: (intensity) => `sepia(${intensity / 100})`,
  marvin: (intensity) => `invert(${intensity}%)`,
  phobos: (intensity) => `blur(${intensity * 3 / 100}px)`,
  heat: (intensity) => `brightness(${(intensity * 2 / 100) + 1})`,
};

let currentScaleValue = DEFAULT_SCALE_VALUE;
let currentEffect = DEFAULT_EFFECT;

const onEffectsRadioListChange = (event) => {
  currentEffect = event.target.value;

  if (currentEffect === `none`) {
    imageUploadEffectLevel.classList.add(`hidden`);
  } else {
    imageUploadEffectLevel.classList.remove(`hidden`);
  }

  applyEffect(currentEffect, DEFAULT_EFFECT_INTENSITY);
};

const onScaleControlClick = (event) => {
  const direction = event.target === scaleControlSmaller ? -1 : 1;
  changeScale(direction);
};

const onEffectLineMouseDown = (event) => {
  event.preventDefault();
  changeEffectByMouseEvent(event);
};

const onEffectPinMouseMove = (event) => {
  event.preventDefault();
  changeEffectByMouseEvent(event);
};

const onEffectPinMouseDown = (event) => {
  event.preventDefault();
  changeEffectByMouseEvent(event);
  document.addEventListener(`mousemove`, onEffectPinMouseMove);
  document.addEventListener(`mouseup`, onEffectPinMouseUp);
};

const onEffectPinMouseUp = (event) => {
  event.preventDefault();
  changeEffectByMouseEvent(event);
  document.removeEventListener(`mousemove`, onEffectPinMouseMove);
  document.removeEventListener(`mouseup`, onEffectPinMouseUp);
};

const reset = () => {
  currentScaleValue = DEFAULT_SCALE_VALUE;
  currentEffect = DEFAULT_EFFECT;

  applyEffect(currentEffect, DEFAULT_EFFECT_INTENSITY);
  applyScale(currentScaleValue);
};

const enable = () => {
  effectLevelLine.addEventListener(`mousedown`, onEffectLineMouseDown);
  effectLevelPin.addEventListener(`mousedown`, onEffectPinMouseDown);

  scaleControlSmaller.addEventListener(`click`, onScaleControlClick);
  scaleControlBigger.addEventListener(`click`, onScaleControlClick);
  imageUploadEffects.addEventListener(`change`, onEffectsRadioListChange);
};

const disable = () => {
  effectLevelLine.removeEventListener(`mousedown`, onEffectLineMouseDown);
  effectLevelPin.removeEventListener(`mousedown`, onEffectPinMouseDown);

  scaleControlSmaller.removeEventListener(`click`, onScaleControlClick);
  scaleControlBigger.removeEventListener(`click`, onScaleControlClick);
  imageUploadEffects.removeEventListener(`change`, onEffectsRadioListChange);
};

const changeEffectByMouseEvent = (event) => {
  const rect = effectLevelLine.getBoundingClientRect();
  const left = event.clientX - rect.left;
  const intensity = window.util.between(left * 100 / rect.width, 0, 100);
  applyEffect(currentEffect, intensity);
};

const applyEffect = (effect, intensity) => {
  imageForChange.className = `effects__preview--${effect}`;
  imageForChange.style.filter = effects[effect](intensity);

  if (effect === `none`) {
    imageUploadEffectLevel.classList.add(`hidden`);
  } else {
    imageUploadEffectLevel.classList.remove(`hidden`);
    const width = effectLevelLine.offsetWidth;
    const left = intensity * width / 100;
    effectLevelPin.style.left = `${left}px`;
    effectLevelDepth.style.width = `${left}px`;
  }
  effectLevelValue.value = intensity;
};

const changeScale = (direction) => {
  const newScaleValue = currentScaleValue + STEP_SCALE_VALUE * direction;
  currentScaleValue = window.util.between(newScaleValue, MIN_SCALE, MAX_SCALE);
  applyScale(currentScaleValue);
};

const applyScale = (scale) => {
  scaleControlValue.value = `${scale}%`;
  imageForChange.style.transform = `scale(${scale / 100})`;
};

window.editorEffect = {
  reset,
  enable,
  disable,
};
