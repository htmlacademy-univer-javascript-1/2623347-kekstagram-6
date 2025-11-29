import { openFullPhoto } from './full-photo.js';

const createThumbnail = (data) => {
  const pictureTemplate = document.querySelector('#picture');
  const thumbnail = pictureTemplate.content.querySelector('.picture').cloneNode(true);

  const image = thumbnail.querySelector('.picture__img');
  image.src = data.url;
  image.alt = data.description;

  thumbnail.querySelector('.picture__comments').textContent = data.comments.length;
  thumbnail.querySelector('.picture__likes').textContent = data.likes;

  thumbnail.dataset.photoId = data.id;

  thumbnail.addEventListener('click', (evt) => {
    evt.preventDefault();
    openFullPhoto(data);

    document.addEventListener('keydown', (escEvt) => {
      if (escEvt.key === 'Escape') {
        evt.preventDefault();
        document.querySelector('.big-picture').classList.add('hidden');
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', arguments.callee);
      }
    });
  });

  return thumbnail;
};

const renderThumbnails = (photosData) => {
  const picturesContainer = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();

  photosData.forEach((photoData) => {
    const thumbnail = createThumbnail(photoData);
    fragment.appendChild(thumbnail);
  });

  const existingThumbnails = picturesContainer.querySelectorAll('.picture');
  existingThumbnails.forEach(thumbnail => {
    if (!thumbnail.closest('.img-upload')) {
      thumbnail.remove();
    }
  });

  const uploadForm = picturesContainer.querySelector('.img-upload');
  picturesContainer.insertBefore(fragment, uploadForm);
};

const clearThumbnails = () => {
  const picturesContainer = document.querySelector('.pictures');
  const existingThumbnails = picturesContainer.querySelectorAll('.picture');

  existingThumbnails.forEach(thumbnail => {
    if (!thumbnail.closest('.img-upload')) {
      thumbnail.remove();
    }
  });
};

const initThumbnails = (photosData) => {
  renderThumbnails(photosData);
};

export { initThumbnails, renderThumbnails, clearThumbnails };
