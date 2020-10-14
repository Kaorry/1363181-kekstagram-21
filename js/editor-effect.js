'use strict';

(function () {
  const imgUploadPreviewContainer = document.querySelector(`.img-upload__preview-container`);
  const imgUploadEffects = document.querySelector(`.img-upload__effects`);

  const imageUploadPreview = imgUploadPreviewContainer.querySelector(`.img-upload__preview`);
  const imageForChange = imageUploadPreview.querySelector(`img`);

  const imgUploadEffectLevel = imgUploadPreviewContainer.querySelector(`.img-upload__effect-level`);
  const effectLevelLine = imgUploadPreviewContainer.querySelector(`.effect-level__line`);
  const effectLevelPin = imgUploadPreviewContainer.querySelector(`.effect-level__pin`);
  const effectLevelDepth = imgUploadPreviewContainer.querySelector(`.effect-level__depth`);
  const effectLevelValue = imgUploadPreviewContainer.querySelector(`.effect-level__value`);

  const scaleControlSmaller = imgUploadPreviewContainer.querySelector(`.scale__control--smaller`);
  const scaleControlBigger = imgUploadPreviewContainer.querySelector(`.scale__control--bigger`);
  const scaleControlValue = imgUploadPreviewContainer.querySelector(`.scale__control--value`);

  const effects = {
    none: () => ``,
    chrome: (intensity) => `grayscale(${intensity / 100})`,
    sepia: (intensity) => `sepia(${intensity / 100})`,
    marvin: (intensity) => `invert(${intensity}%)`,
    phobos: (intensity) => `blur(${intensity * 3 / 100}px)`,
    heat: (intensity) => `brightness(${(intensity * 2 / 100) + 1})`,
  };

  let currentScaleValue = window.const.DEFAULT_SCALE_VALUE;
  let currentEffect = window.const.DEFAULT_EFFECT;

  const reset = () => {
    currentScaleValue = window.const.DEFAULT_SCALE_VALUE;
    currentEffect = window.const.DEFAULT_EFFECT;

    applyEffect(currentEffect, window.const.DEFAULT_EFFECT_INTENSITY);
    applyScale(currentScaleValue);
  };

  const enable = () => {
    effectLevelLine.addEventListener(`mouseup`, onEffectLineMouseUp);
    scaleControlSmaller.addEventListener(`click`, onScaleControlClick);
    scaleControlBigger.addEventListener(`click`, onScaleControlClick);
    imgUploadEffects.addEventListener(`change`, onEffectsRadioListChange);

  };

  const disable = () => {
    effectLevelLine.removeEventListener(`mouseup`, onEffectLineMouseUp);
    scaleControlSmaller.removeEventListener(`click`, onScaleControlClick);
    scaleControlBigger.removeEventListener(`click`, onScaleControlClick);
    imgUploadEffects.removeEventListener(`change`, onEffectsRadioListChange);
  };

  const onEffectsRadioListChange = (event) => {
    currentEffect = event.target.value;

    if (currentEffect === `none`) {
      imgUploadEffectLevel.classList.add(`hidden`);
    } else {
      imgUploadEffectLevel.classList.remove(`hidden`);
    }

    applyEffect(currentEffect, window.const.DEFAULT_EFFECT_INTENSITY);
  };

  const onScaleControlClick = (event) => {
    const direction = event.target === scaleControlSmaller ? -1 : 1;
    changeScale(direction);
  };

  const onEffectLineMouseUp = (event) => {
    event.preventDefault();

    const rect = effectLevelLine.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const intensity = left * 100 / rect.width;
    applyEffect(currentEffect, intensity);
  };

  const applyEffect = (effect, intensity) => {
    imageForChange.className = `effects__preview--${effect}`;
    imageForChange.style.filter = effects[effect](intensity);

    if (effect === `none`) {
      imgUploadEffectLevel.classList.add(`hidden`);
    } else {
      imgUploadEffectLevel.classList.remove(`hidden`);
      const width = effectLevelLine.offsetWidth;
      const left = intensity * width / 100;
      effectLevelPin.style.left = `${left}px`;
      effectLevelDepth.style.width = `${left}px`;
    }
    effectLevelValue.value = intensity;
  };

  const changeScale = (direction) => {
    const newScaleValue = currentScaleValue + window.const.STEP_SCALE_VALUE * direction;
    currentScaleValue = window.util.between(newScaleValue, 25, 100);
    applyScale(currentScaleValue);
  };

  const applyScale = (scale) => {
    scaleControlValue.value = `${scale}%`;
    imageForChange.style.transform = `scale(${scale / 100})`;
  };

  window.editorEffect = {
    reset,
    enable,
    disable
  };
})();
