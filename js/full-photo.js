let currentComments = [];
let commentsShown = 0;
const COMMENTS_PER_PAGE = 5;

const createComment = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;

  return commentElement;
};

const renderComments = () => {
  const commentsContainer = document.querySelector('.social__comments');
  const commentCountBlock = document.querySelector('.social__comment-count');
  const commentsLoader = document.querySelector('.comments-loader');

  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PAGE);

  const fragment = document.createDocumentFragment();

  commentsToShow.forEach((comment) => {
    const commentElement = createComment(comment);
    fragment.appendChild(commentElement);
  });

  commentsContainer.appendChild(fragment);

  commentsShown += commentsToShow.length;

  commentCountBlock.innerHTML = `${commentsShown} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const loadMoreComments = () => {
  renderComments();
};

const resetComments = () => {
  currentComments = [];
  commentsShown = 0;
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeFullPhoto();
  }
};

const openFullPhoto = (photoData) => {
  const bigPicture = document.querySelector('.big-picture');
  const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  const socialCaption = bigPicture.querySelector('.social__caption');
  const commentCountBlock = bigPicture.querySelector('.social__comment-count');
  const commentsLoader = bigPicture.querySelector('.comments-loader');
  const socialComments = bigPicture.querySelector('.social__comments');

  resetComments();

  currentComments = photoData.comments;

  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = currentComments.length;
  socialCaption.textContent = photoData.description;

  socialComments.innerHTML = '';

  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderComments();

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
};

const closeFullPhoto = () => {
  const bigPicture = document.querySelector('.big-picture');
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
};

const initFullPhoto = () => {
  const closeButton = document.querySelector('.big-picture__cancel');
  const commentsLoader = document.querySelector('.comments-loader');

  if (!closeButton || !commentsLoader) {
    return;
  }

  closeButton.addEventListener('click', () => {
    closeFullPhoto();
  });

  commentsLoader.addEventListener('click', loadMoreComments);
};

export { openFullPhoto, closeFullPhoto, initFullPhoto };
