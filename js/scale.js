const SCALE_SMALLER_BUTTON_SELECTOR = '.scale__control--smaller';
const SCALE_BIGGER_BUTTON_SELECTOR = '.scale__control--bigger';
const SCALE_VALUE_SELECTOR = '.scale__control--value';
const IMAGE_PREVIEW_SELECTOR = '.img-upload__preview img';

const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

const initImageScale = () => {
  const scaleSmallerButton = document.querySelector(SCALE_SMALLER_BUTTON_SELECTOR);
  const scaleBiggerButton = document.querySelector(SCALE_BIGGER_BUTTON_SELECTOR);
  const scaleValueInput = document.querySelector(SCALE_VALUE_SELECTOR);
  const imagePreview = document.querySelector(IMAGE_PREVIEW_SELECTOR);

  if (!scaleSmallerButton || !scaleBiggerButton || !scaleValueInput || !imagePreview) {
    console.error('Не найдены элементы управления масштабом');
    return null;
  }

  let currentScale = DEFAULT_SCALE;

  const updateImageScale = () => {
    scaleValueInput.value = `${currentScale}%`;

    const scaleFactor = currentScale / 100;
    imagePreview.style.transform = `scale(${scaleFactor})`;
  };

  const onScaleSmallerClick = () => {
    if (currentScale > MIN_SCALE) {
      currentScale -= SCALE_STEP;
      updateImageScale();
    }
  };

  const onScaleBiggerClick = () => {
    if (currentScale < MAX_SCALE) {
      currentScale += SCALE_STEP;
      updateImageScale();
    }
  };

  const resetScale = () => {
    currentScale = DEFAULT_SCALE;
    updateImageScale();
  };

  const init = () => {
    updateImageScale();

    scaleSmallerButton.addEventListener('click', onScaleSmallerClick);
    scaleBiggerButton.addEventListener('click', onScaleBiggerClick);

    console.log('Масштабирование изображения инициализировано');
  };

  const destroy = () => {
    scaleSmallerButton.removeEventListener('click', onScaleSmallerClick);
    scaleBiggerButton.removeEventListener('click', onScaleBiggerClick);
  };

  return {
    init,
    destroy,
    reset: resetScale,
    getCurrentScale: () => currentScale
  };
};

export { initImageScale };
