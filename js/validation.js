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

export const validateHashtags = (hashtagString) => {
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

export const validateComment = (comment) => {
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

export const createValidationStyles = () => {
  if (document.querySelector('#validation-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'validation-styles';
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

export const showValidationError = (inputElement, message) => {
  const parent = inputElement.parentElement;
  const oldError = parent.querySelector('.validation-error');

  if (oldError) {
    oldError.remove();
  }

  inputElement.classList.remove('input--valid');
  inputElement.classList.add('input--invalid');

  if (message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.textContent = message;
    parent.appendChild(errorElement);
  }
};

export const showValidationSuccess = (inputElement) => {
  const parent = inputElement.parentElement;
  const oldError = parent.querySelector('.validation-error');

  if (oldError) {
    oldError.remove();
  }

  inputElement.classList.remove('input--invalid');
  inputElement.classList.add('input--valid');
};

export const clearValidationStyles = (inputElement) => {
  const parent = inputElement.parentElement;
  const oldError = parent.querySelector('.validation-error');

  if (oldError) {
    oldError.remove();
  }

  inputElement.classList.remove('input--valid', 'input--invalid');
};

export const setupValidationListener = (inputElement, validationFn, delay = 500) => {
  let timeoutId;

  const handleValidation = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const validation = validationFn(inputElement.value);
      if (!validation.isValid) {
        showValidationError(inputElement, validation.errorMessage);
      } else {
        showValidationSuccess(inputElement);
      }
    }, delay);
  };

  inputElement.addEventListener('input', handleValidation);

  return () => {
    inputElement.removeEventListener('input', handleValidation);
    clearTimeout(timeoutId);
  };
};

export const validateAllFields = (hashtagsValue, commentValue) => {
  const results = {
    isValid: true,
    hashtags: null,
    comment: null
  };

  const hashtagsValidation = validateHashtags(hashtagsValue);
  if (!hashtagsValidation.isValid) {
    results.isValid = false;
    results.hashtags = hashtagsValidation;
  }

  const commentValidation = validateComment(commentValue);
  if (!commentValidation.isValid) {
    results.isValid = false;
    results.comment = commentValidation;
  }

  return results;
};
