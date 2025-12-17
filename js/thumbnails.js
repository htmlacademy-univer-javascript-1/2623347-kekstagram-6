import { openFullPhoto } from './full-photo.js';
import { debounce } from './util.js';

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

const sortByComments = (a, b) => b.comments.length - a.comments.length;

const getRandomPhotos = (photos, count = 10) => {
  const shuffled = [...photos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const initThumbnails = (photosData) => {
  const defaultFilterButton = document.querySelector('#filter-default');
  const randomFilterButton = document.querySelector('#filter-random');
  const discussedFilterButton = document.querySelector('#filter-discussed');
  const imgFilters = document.querySelector('.img-filters');

  if (imgFilters) {
    imgFilters.classList.remove('img-filters--inactive');
  }

  const debouncedRender = debounce((photos) => {
    clearThumbnails();
    renderThumbnails(photos);
  }, 500);

  const setActiveButton = (activeButton) => {
    document.querySelectorAll('.img-filters__button').forEach(button => {
      button.classList.remove('img-filters__button--active');
    });
    activeButton.classList.add('img-filters__button--active');
  };

  const onDefaultFilterClick = () => {
    setActiveButton(defaultFilterButton);
    debouncedRender(photosData);
  };

  const onRandomFilterClick = () => {
    setActiveButton(randomFilterButton);
    debouncedRender(getRandomPhotos(photosData));
  };

  const onDiscussedFilterClick = () => {
    setActiveButton(discussedFilterButton);
    const sortedPhotos = [...photosData].sort(sortByComments);
    debouncedRender(sortedPhotos);
  };

  defaultFilterButton.addEventListener('click', onDefaultFilterClick);
  randomFilterButton.addEventListener('click', onRandomFilterClick);
  discussedFilterButton.addEventListener('click', onDiscussedFilterClick);

  renderThumbnails(photosData);
};

export { initThumbnails, renderThumbnails, clearThumbnails };