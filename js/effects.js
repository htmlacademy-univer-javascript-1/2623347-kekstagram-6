const EFFECTS = {
  none: {
    name: 'none',
    css: () => 'none',
    options: null,
    unit: '',
  },
  chrome: {
    name: 'chrome',
    css: (value) => `grayscale(${value})`,
    options: {
      range: { min: 0, max: 1 },
      start: 1,
      step: 0.1,
    },
    unit: '',
  },
  sepia: {
    name: 'sepia',
    css: (value) => `sepia(${value})`,
    options: {
      range: { min: 0, max: 1 },
      start: 1,
      step: 0.1,
    },
    unit: '',
  },
  marvin: {
    name: 'marvin',
    css: (value) => `invert(${value}%)`,
    options: {
      range: { min: 0, max: 100 },
      start: 100,
      step: 1,
    },
    unit: '%',
  },
  phobos: {
    name: 'phobos',
    css: (value) => `blur(${value}px)`,
    options: {
      range: { min: 0, max: 3 },
      start: 3,
      step: 0.1,
    },
    unit: 'px',
  },
  heat: {
    name: 'heat',
    css: (value) => `brightness(${value})`,
    options: {
      range: { min: 1, max: 3 },
      start: 3,
      step: 0.1,
    },
    unit: '',
  },
};

const imgUploadPreview = document.querySelector('.img-upload__preview img');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = effectLevelContainer.querySelector('.effect-level__slider');
const effectLevelValueInput = effectLevelContainer.querySelector('.effect-level__value');
const effectsRadioList = document.querySelectorAll('.effects__radio');

let currentEffect = EFFECTS.none;
let slider = null;

const initSlider = () => {
  if (!window.noUiSlider) {
    console.warn('noUiSlider не подключен');
    return;
  }

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }

  slider = noUiSlider.create(effectLevelSlider, {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: function (value) {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(1);
      },
      from: function (value) {
        return parseFloat(value);
      },
    }
  });

  slider.on('update', (values) => {
    const value = parseFloat(values[0]);

    effectLevelValueInput.value = value;

    if (currentEffect.name === 'none') {
      imgUploadPreview.style.filter = 'none';
    } else {
      imgUploadPreview.style.filter = currentEffect.css(value);
    }
  });
};

const updateSliderForEffect = (effect) => {
  if (!slider) {
    return;
  }

  if (!effect.options) {
    effectLevelContainer.classList.add('hidden');
    imgUploadPreview.style.filter = 'none';
    effectLevelValueInput.value = '';
    return;
  }

  effectLevelContainer.classList.remove('hidden');

  const { range, start, step } = effect.options;

  slider.updateOptions({
    range,
    start,
    step,
    format: {
      to: function (value) {
        return value.toFixed(1);
      },
      from: function (value) {
        return parseFloat(value);
      },
    }
  });

  slider.set(start);
};

const onEffectChange = (evt) => {
  const effectName = evt.target.value;
  const selectedEffect = EFFECTS[effectName] || EFFECTS.none;

  currentEffect = selectedEffect;
  updateSliderForEffect(currentEffect);

  imgUploadPreview.className = '';
  if (effectName !== 'none') {
    imgUploadPreview.classList.add(`effects__preview--${effectName}`);
  }
};

const resetEffects = () => {
  if (slider) {
    slider.destroy();
    slider = null;
  }

  currentEffect = EFFECTS.none;
  imgUploadPreview.style.filter = 'none';
  imgUploadPreview.className = '';

  const noneRadio = document.querySelector('#effect-none');
  if (noneRadio) {
    noneRadio.checked = true;
  }

  if (effectLevelContainer) {
    effectLevelContainer.classList.add('hidden');
  }

  if (effectLevelValueInput) {
    effectLevelValueInput.value = '';
  }
};

export const initEffects = () => {
  if (!imgUploadPreview || !effectLevelContainer || !effectLevelSlider || !effectLevelValueInput) {
    console.warn('Не все элементы для эффектов найдены');
    return;
  }

  initSlider();

  effectsRadioList.forEach((radio) => {
    radio.addEventListener('change', onEffectChange);
  });

  currentEffect = EFFECTS.none;
  effectLevelContainer.classList.add('hidden');
  imgUploadPreview.style.filter = 'none';
  effectLevelValueInput.value = '';

  console.log('Модуль эффектов инициализирован');
};

export { resetEffects };
