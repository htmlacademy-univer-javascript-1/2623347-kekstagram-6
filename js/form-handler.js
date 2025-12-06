import { initImageScale } from './scale.js';

const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';
const UPLOAD_FORM_SELECTOR = '.img-upload__form';
const FILE_INPUT_SELECTOR = '.img-upload__input';
const OVERLAY_SELECTOR = '.img-upload__overlay';
const CANCEL_BUTTON_SELECTOR = '.img-upload__cancel';
const SUBMIT_BUTTON_SELECTOR = '.img-upload__submit';
const HASHTAGS_INPUT_SELECTOR = '.text__hashtags';
const COMMENT_INPUT_SELECTOR = '.text__description';

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_PATTERN = /^#[a-zA-Zа-яА-ЯёЁ0-9]+$/;

const normalizeHashtag = (hashtag) => hashtag.toLowerCase().trim();

const splitHashtags = (hashtagString) => {
  return hashtagString
    .trim()
    .split(' ')
    .filter(tag => tag.length > 0);
};

const validateHashtagFormat = (hashtag) => {
  if (hashtag === '') {
    return { isValid: true };
  }

  if (hashtag[0] !== '#') {
    return {
      isValid: false,
      errorMessage: 'Хэш-тег должен начинаться с символа #'
    };
  }

  if (hashtag.length === 1) {
    return {
      isValid: false,
      errorMessage: 'Хэш-тег не может состоять только из решетки'
    };
  }

  if (hashtag.length > MAX_HASHTAG_LENGTH) {
    return {
      isValid: false,
      errorMessage: `Максимальная длина хэш-тега ${MAX_HASHTAG_LENGTH} символов`
    };
  }

  if (!HASHTAG_PATTERN.test(hashtag)) {
    return {
      isValid: false,
      errorMessage: 'Хэш-тег должен состоять из букв и цифр, без пробелов и спецсимволов'
    };
  }

  if (hashtag.indexOf('#', 1) !== -1) {
    return {
      isValid: false,
      errorMessage: 'В хэш-теге не должно быть пробелов и лишних символов #'
    };
  }

  return { isValid: true };
};

const validateHashtagUniqueness = (hashtags) => {
  const normalizedTags = hashtags.map(normalizeHashtag);
  const uniqueTags = [...new Set(normalizedTags)];

  if (normalizedTags.length !== uniqueTags.length) {
    return {
      isValid: false,
      errorMessage: 'Хэш-теги не должны повторяться'
    };
  }

  return { isValid: true };
};

const validateHashtagCount = (hashtags) => {
  if (hashtags.length > MAX_HASHTAGS) {
    return {
      isValid: false,
      errorMessage: `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`
    };
  }

  return { isValid: true };
};

const validateHashtags = (hashtagString) => {
  const hashtags = splitHashtags(hashtagString);

  if (hashtags.length === 0) {
    return { isValid: true };
  }

  for (let i = 0; i < hashtags.length; i++) {
    const validation = validateHashtagFormat(hashtags[i]);
    if (!validation.isValid) {
      return {
        isValid: false,
        errorMessage: `Хэш-тег ${i + 1}: ${validation.errorMessage}`
      };
    }
  }

  const countValidation = validateHashtagCount(hashtags);
  if (!countValidation.isValid) {
    return countValidation;
  }

  const uniquenessValidation = validateHashtagUniqueness(hashtags);
  if (!uniquenessValidation.isValid) {
    return uniquenessValidation;
  }

  return { isValid: true };
};

const validateComment = (comment) => {
  if (comment.length === 0) {
    return { isValid: true };
  }

  if (comment.length > MAX_COMMENT_LENGTH) {
    return {
      isValid: false,
      errorMessage: `Длина комментария не может превышать ${MAX_COMMENT_LENGTH} символов. Сейчас: ${comment.length}`
    };
  }

  return { isValid: true };
};

const initFormHandler = () => {
  const form = document.querySelector(UPLOAD_FORM_SELECTOR);
  const fileInput = document.querySelector(FILE_INPUT_SELECTOR);
  const overlay = document.querySelector(OVERLAY_SELECTOR);
  const cancelButton = document.querySelector(CANCEL_BUTTON_SELECTOR);
  const submitButton = document.querySelector(SUBMIT_BUTTON_SELECTOR);
  const hashtagsInput = document.querySelector(HASHTAGS_INPUT_SELECTOR);
  const commentInput = document.querySelector(COMMENT_INPUT_SELECTOR);

  let isSubmitting = false;
  let scaleController = null;
  let onDocumentKeydownHandler = null;

  const addValidationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .text__hashtags.input--valid,
      .text__description.input--valid {
        border-color: #4caf50 !important;
        background-color: rgba(76, 175, 80, 0.05) !important;
      }

      .text__hashtags.input--invalid,
      .text__description.input--invalid {
        border-color: #ff5635 !important;
        background-color: rgba(255, 86, 53, 0.05) !important;
      }

      .validation-error {
        color: #ff5635;
        font-size: 12px;
        margin-top: 5px;
        padding: 5px 10px;
        border-radius: 3px;
        background-color: rgba(255, 86, 53, 0.1);
        border-left: 3px solid #ff5635;
      }

      .text__hashtags:focus,
      .text__description:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
      }
    `;
    document.head.appendChild(style);
  };

  const showValidationError = (inputElement, message) => {
    const oldError = inputElement.parentElement.querySelector('.validation-error');
    if (oldError) {
      oldError.remove();
    }

    inputElement.classList.remove('input--valid');
    inputElement.classList.add('input--invalid');

    if (message) {
      const errorElement = document.createElement('div');
      errorElement.className = 'validation-error';
      errorElement.textContent = message;
      inputElement.parentElement.appendChild(errorElement);
    }
  };

  const showValidationSuccess = (inputElement) => {
    const oldError = inputElement.parentElement.querySelector('.validation-error');
    if (oldError) {
      oldError.remove();
    }

    inputElement.classList.remove('input--invalid');
    inputElement.classList.add('input--valid');
  };

  fileInput.addEventListener('change', () => {
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');

    scaleController = initImageScale();
    if (scaleController) {
      scaleController.init();
    }
  });

  const closeForm = () => {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    form.reset();

    if (scaleController) {
      scaleController.reset();
      scaleController.destroy();
      scaleController = null;
    }

    [hashtagsInput, commentInput].forEach(input => {
      input.classList.remove('input--valid', 'input--invalid');
      const oldError = input.parentElement.querySelector('.validation-error');
      if (oldError) {
        oldError.remove();
      }
    });

    if (onDocumentKeydownHandler) {
      document.removeEventListener('keydown', onDocumentKeydownHandler);
      onDocumentKeydownHandler = null;
    }
  };

  cancelButton.addEventListener('click', closeForm);

  onDocumentKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      const activeElement = document.activeElement;
      if (activeElement === hashtagsInput || activeElement === commentInput) {
        return;
      }
      evt.preventDefault();
      closeForm();
    }
  };

  document.addEventListener('keydown', onDocumentKeydownHandler);

  [hashtagsInput, commentInput].forEach(input => {
    input.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.stopPropagation();
      }
    });
  });

  let validationTimeout;
  const validateWithDelay = (inputElement, validationFn) => {
    clearTimeout(validationTimeout);
    validationTimeout = setTimeout(() => {
      const validation = validationFn(inputElement.value);
      if (!validation.isValid) {
        showValidationError(inputElement, validation.errorMessage);
      } else {
        showValidationSuccess(inputElement);
      }
    }, 500);
  };

  hashtagsInput.addEventListener('input', () => {
    validateWithDelay(hashtagsInput, validateHashtags);
  });

  commentInput.addEventListener('input', () => {
    validateWithDelay(commentInput, validateComment);
  });

  const validateFormFields = () => {
    let isValid = true;

    const hashtagsValidation = validateHashtags(hashtagsInput.value);
    if (!hashtagsValidation.isValid) {
      showValidationError(hashtagsInput, hashtagsValidation.errorMessage);
      isValid = false;
    } else {
      showValidationSuccess(hashtagsInput);
    }

    const commentValidation = validateComment(commentInput.value);
    if (!commentValidation.isValid) {
      showValidationError(commentInput, commentValidation.errorMessage);
      isValid = false;
    } else {
      showValidationSuccess(commentInput);
    }

    return isValid;
  };

  const blockSubmitButton = () => {
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    isSubmitting = true;
  };

  const unblockSubmitButton = () => {
    submitButton.disabled = false;
    submitButton.textContent = 'Опубликовать';
    isSubmitting = false;
  };

  const showError = (message) => {
    alert(`Ошибка: ${message}`);
  };

  const showSuccess = () => {
    alert('Фотография успешно загружена!');
    closeForm();
  };

  const uploadFormData = (formData) => {
    blockSubmitButton();

    fetch(SERVER_URL, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        showSuccess();
        console.log('Данные успешно отправлены:', data);
      })
      .catch((error) => {
        showError(error.message);
        console.error('Ошибка отправки:', error);
      })
      .finally(() => {
        unblockSubmitButton();
      });
  };

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      showError('Пожалуйста, выберите фотографию для загрузки');
      return;
    }

    if (!validateFormFields()) {
      showError('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    const formData = new FormData(form);

    uploadFormData(formData);
  });

  addValidationStyles();

  window.addEventListener('beforeunload', () => {
    if (scaleController) {
      scaleController.destroy();
    }

    if (onDocumentKeydownHandler) {
      document.removeEventListener('keydown', onDocumentKeydownHandler);
    }
  });
};

export { initFormHandler };
