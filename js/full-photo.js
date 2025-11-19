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

const renderComments = (comments) => {
  const commentsContainer = document.querySelector('.social__comments');
  const fragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const commentElement = createComment(comment);
    fragment.appendChild(commentElement);
  });

  commentsContainer.innerHTML = '';
  commentsContainer.appendChild(fragment);
};

const openFullPhoto = (photoData) => {
  const bigPicture = document.querySelector('.big-picture');
  const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  const socialCaption = bigPicture.querySelector('.social__caption');
  const commentCountBlock = bigPicture.querySelector('.social__comment-count');
  const commentsLoader = bigPicture.querySelector('.comments-loader');

  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  socialCaption.textContent = photoData.description;

  renderComments(photoData.comments);

  commentCountBlock.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  bigPicture.classList.remove('hidden');

  document.body.classList.add('modal-open');
};

const closeFullPhoto = () => {
  const bigPicture = document.querySelector('.big-picture');

  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeFullPhoto();
    document.removeEventListener('keydown', onDocumentKeydown);
  }
};

const initFullPhoto = () => {
  const closeButton = document.querySelector('.big-picture__cancel');

  closeButton.addEventListener('click', () => {
    closeFullPhoto();
    document.removeEventListener('keydown', onDocumentKeydown);
  });
};

export { openFullPhoto, closeFullPhoto, initFullPhoto };
