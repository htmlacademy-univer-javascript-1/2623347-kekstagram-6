import { initImageScale } from './scale.js';
import { initEffects, resetEffects } from './effects.js';
import {
  validateHashtags,
  validateComment,
  createValidationStyles,
  showValidationError,
  showValidationSuccess,
  clearValidationStyles,
  setupValidationListener,
  validateAllFields
} from './validation.js';

import { uploadPhoto } from './api.js';
const UPLOAD_FORM_SELECTOR = '.img-upload__form';
const FILE_INPUT_SELECTOR = '.img-upload__input';
const OVERLAY_SELECTOR = '.img-upload__overlay';
const CANCEL_BUTTON_SELECTOR = '.img-upload__cancel';
const SUBMIT_BUTTON_SELECTOR = '.img-upload__submit';
const HASHTAGS_INPUT_SELECTOR = '.text__hashtags';
const COMMENT_INPUT_SELECTOR = '.text__description';
const IMAGE_PREVIEW_SELECTOR = '.img-upload__preview img';

const initFormHandler = () => {
  const form = document.querySelector(UPLOAD_FORM_SELECTOR);
  const fileInput = document.querySelector(FILE_INPUT_SELECTOR);
  const overlay = document.querySelector(OVERLAY_SELECTOR);
  const cancelButton = document.querySelector(CANCEL_BUTTON_SELECTOR);
  const submitButton = document.querySelector(SUBMIT_BUTTON_SELECTOR);
  const hashtagsInput = document.querySelector(HASHTAGS_INPUT_SELECTOR);
  const commentInput = document.querySelector(COMMENT_INPUT_SELECTOR);
  const imagePreview = document.querySelector(IMAGE_PREVIEW_SELECTOR);

  if (!form || !fileInput || !overlay || !cancelButton || !submitButton || !hashtagsInput || !commentInput || !imagePreview) {
    return;
  }

  let isSubmitting = false;
  let scaleController = null;
  let currentImageUrl = null;
  let cleanupHashtagsListener = null;
  let cleanupCommentListener = null;

  createValidationStyles();

  const updateImagePreview = (file) => {
    if (currentImageUrl) {
      URL.revokeObjectURL(currentImageUrl);
    }

    currentImageUrl = URL.createObjectURL(file);
    imagePreview.src = currentImageUrl;
    imagePreview.alt = 'Загруженное изображение';
  };

  const handleFileInputChange = () => {
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }

    const file = fileInput.files[0];

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      fileInput.value = '';
      return;
    }

    updateImagePreview(file);
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');

    scaleController = initImageScale();
    if (scaleController) {
      scaleController.init();
    }

    initEffects();

    if (cleanupHashtagsListener) {
      cleanupHashtagsListener();
    }
    if (cleanupCommentListener) {
      cleanupCommentListener();
    }

    cleanupHashtagsListener = setupValidationListener(hashtagsInput, validateHashtags);
    cleanupCommentListener = setupValidationListener(commentInput, validateComment);
  };

  fileInput.addEventListener('change', handleFileInputChange);

  const closeForm = () => {
    if (overlay.classList.contains('hidden')) {
      return;
    }

    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');

    form.reset();

    if (scaleController) {
      scaleController.reset();
      scaleController.destroy();
      scaleController = null;
    }

    resetEffects();

    if (currentImageUrl) {
      URL.revokeObjectURL(currentImageUrl);
      currentImageUrl = null;
    }

    imagePreview.src = 'img/upload-default-image.jpg';
    imagePreview.alt = 'Предварительный просмотр фотографии';
    imagePreview.style.filter = 'none';
    imagePreview.style.transform = 'none';

    clearValidationStyles(hashtagsInput);
    clearValidationStyles(commentInput);

    fileInput.value = '';

    const noneRadio = document.querySelector('#effect-none');
    if (noneRadio) {
      noneRadio.checked = true;
    }

    const scaleValue = document.querySelector('.scale__control--value');
    if (scaleValue) {
      scaleValue.value = '100%';
    }

    if (cleanupHashtagsListener) {
      cleanupHashtagsListener();
      cleanupHashtagsListener = null;
    }
    if (cleanupCommentListener) {
      cleanupCommentListener();
      cleanupCommentListener = null;
    }
  };

  cancelButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    closeForm();
  });

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      if (overlay.classList.contains('hidden')) {
        return;
      }

      const bigPicture = document.querySelector('.big-picture');
      if (bigPicture && !bigPicture.classList.contains('hidden')) {
        return;
      }

      const activeElement = document.activeElement;

      if (activeElement === hashtagsInput || activeElement === commentInput) {
        return;
      }

      evt.preventDefault();
      closeForm();
    }
  };

  document.addEventListener('keydown', onDocumentKeydown);

  [hashtagsInput, commentInput].forEach(input => {
    input.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.stopPropagation();
        input.blur();
      }
    });

    input.addEventListener('focus', () => {
      document.removeEventListener('keydown', onDocumentKeydown);
    });

    input.addEventListener('blur', () => {
      setTimeout(() => {
        document.addEventListener('keydown', onDocumentKeydown);
      }, 100);
    });
  });

  const validateForm = () => {
    let isValid = true;

    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Пожалуйста, выберите фотографию для загрузки');
      return false;
    }

    const validationResults = validateAllFields(hashtagsInput.value, commentInput.value);

    if (validationResults.hashtags) {
      if (!validationResults.hashtags.isValid) {
        showValidationError(hashtagsInput, validationResults.hashtags.errorMessage);
        isValid = false;
      } else {
        showValidationSuccess(hashtagsInput);
      }
    }

    if (validationResults.comment) {
      if (!validationResults.comment.isValid) {
        showValidationError(commentInput, validationResults.comment.errorMessage);
        isValid = false;
      } else {
        showValidationSuccess(commentInput);
      }
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
    uploadPhoto(formData)
      .then(() => {
        showSuccess();
      })
      .catch((error) => {
        showError(error.message);
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

    if (!validateForm()) {
      return;
    }

    const formData = new FormData(form);

    const effectLevelValue = document.querySelector('.effect-level__value');
    if (effectLevelValue && effectLevelValue.value) {
      formData.append('effect-level', effectLevelValue.value);
    }

    const scaleValue = document.querySelector('.scale__control--value');
    if (scaleValue) {
      formData.append('scale', scaleValue.value);
    }

    uploadFormData(formData);
  });

  window.addEventListener('beforeunload', () => {
    if (scaleController) {
      scaleController.destroy();
    }

    if (currentImageUrl) {
      URL.revokeObjectURL(currentImageUrl);
    }

    document.removeEventListener('keydown', onDocumentKeydown);

    if (cleanupHashtagsListener) {
      cleanupHashtagsListener();
    }
    if (cleanupCommentListener) {
      cleanupCommentListener();
    }
  });
};

export { initFormHandler };
