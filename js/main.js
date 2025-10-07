let names = ['Саша', 'Маша', 'Петя', 'Катя', 'Вова', 'Лена', 'Дима', 'Оля', 'Коля', 'Настя'];
let comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат.',
  'Лица у людей на фотке перекошены!'
];
let descriptions = [
  'Моя фотка',
  'Красиво получилось',
  'Отдых на море',
  'Гуляли в парке',
  'День рождения',
  'Прогулка с друзьями',
  'Котик',
  'Цветочек',
  'Еда',
  'Пейзаж'
];

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

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
    text = text + getRandomElement(comments);
  }

  let comment = {
    id: newId,
    avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
    message: text,
    name: getRandomElement(names)
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
    description: getRandomElement(descriptions),
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

let myPhotos = createAllPhotos();

console.log('Привет! Я создал 25 фотографий:');
console.log('');

for (let i = 0; i < myPhotos.length; i++) {
  let photo = myPhotos[i];
  console.log('Фото номер ' + (i + 1) + ':');
  console.log('• ID: ' + photo.id);
  console.log('• Файл: ' + photo.url);
  console.log('• Описание: ' + photo.description);
  console.log('• Лайков: ' + photo.likes);
  console.log('• Комментариев: ' + photo.comments.length);

  if (photo.comments.length > 0) {
    console.log('  Комментарии:');
    for (let j = 0; j < photo.comments.length; j++) {
      let comment = photo.comments[j];
      console.log('  - ' + comment.name + ': ' + comment.message);
    }
  }
  console.log('---');
}

console.log('');
console.log('ИТОГО:');
console.log('Всего фото: ' + myPhotos.length);

let totalLikes = 0;
let totalComments = 0;

for (let i = 0; i < myPhotos.length; i++) {
  totalLikes = totalLikes + myPhotos[i].likes;
  totalComments = totalComments + myPhotos[i].comments.length;
}

console.log('Всего лайков: ' + totalLikes);
console.log('Всего комментариев: ' + totalComments);
console.log('В среднем лайков на фото: ' + Math.round(totalLikes / myPhotos.length));
console.log('В среднем комментариев на фото: ' + Math.round(totalComments / myPhotos.length));

console.log('');
console.log('Весь массив данных:');
console.log(myPhotos);
