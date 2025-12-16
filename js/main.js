import { initThumbnails } from './thumbnails.js';
import { initFullPhoto } from './full-photo.js';
import { initFormHandler } from './form-handler.js';
import { loadPhotos } from './api.js';

const showError = () => {
  const errorTemplate = document.querySelector('#error');
  if (!errorTemplate) return;

  const errorElement = errorTemplate.content.cloneNode(true).children[0];
  const errorButton = errorElement.querySelector('.error__button');

  errorButton.addEventListener('click', () => {
    errorElement.remove();
    loadAndRenderPhotos();
  });

  document.body.appendChild(errorElement);
};

const loadAndRenderPhotos = () => {
  loadPhotos()
    .then((photos) => {
      initThumbnails(photos);
    })
    .catch((error) => {
      console.error('Ошибка загрузки фото:', error);
      showError();
    });
};

try {
  initFullPhoto();
  initFormHandler();
  loadAndRenderPhotos();
  console.log('Кекстаграм успешно запущен!');
} catch (error) {
  console.error('Ошибка при запуске приложения:', error);
}