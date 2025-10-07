import { createAllPhotos } from './photo.js';

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
