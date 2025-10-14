import { getRandomNumber, getRandomElement } from './util.js';
import { NAMES, COMMENTS, DESCRIPTIONS } from './data.js';

let allCommentIds = [];

function createComment() {
  let newId;
  let isIdExists;

  do {
    newId = getRandomNumber(1, 1000);
    isIdExists = allCommentIds.includes(newId);
  } while (isIdExists);

  allCommentIds.push(newId);

  let messageCount = getRandomNumber(1, 2);
  let text = '';

  for (let i = 0; i < messageCount; i++) {
    if (i > 0) {
      text = text + ' ';
    }
    text = text + getRandomElement(COMMENTS);
  }

  let comment = {
    id: newId,
    avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
    message: text,
    name: getRandomElement(NAMES)
  };

  return comment;
}

function createCommentsForPhoto() {
  let commentsCount = getRandomNumber(0, 30);
  let commentsList = [];

  for (let i = 0; i < commentsCount; i++) {
    let newComment = createComment();
    commentsList.push(newComment);
  }

  return commentsList;
}

function createPhoto(number) {
  let photo = {
    id: number,
    url: 'photos/' + number + '.jpg',
    description: getRandomElement(DESCRIPTIONS),
    likes: getRandomNumber(15, 200),
    comments: createCommentsForPhoto()
  };

  return photo;
}

function createAllPhotos() {
  let allPhotos = [];

  for (let i = 1; i <= 25; i++) {
    let newPhoto = createPhoto(i);
    allPhotos.push(newPhoto);
  }

  return allPhotos;
}

export { createAllPhotos };
