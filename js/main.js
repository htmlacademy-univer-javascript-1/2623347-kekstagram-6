import { calculateStatistics, displayPhotoDetails } from './statistics.js';
import {
  NAMES,
  COMMENTS,
  DESCRIPTIONS,
  PHOTOS_COUNT,
  MIN_LIKES,
  MAX_LIKES,
  MIN_COMMENTS,
  MAX_COMMENTS,
  MIN_AVATAR,
  MAX_AVATAR,
  MIN_COMMENT_ID,
  MAX_COMMENT_ID,
  MIN_MESSAGES,
  MAX_MESSAGES
} from './constants.js';
//.
function sluchaynoeChislo(ot, doo) {
  return Math.floor(Math.random() * (doo - ot + 1)) + ot;
}

function sluchayniyElement(spisok) {
  return spisok[Math.floor(Math.random() * spisok.length)];
}

let vseIdKommentariev = [];

function sozdatKommentariy() {
  let noviyId;
  let estTakoyId;

  do {
    noviyId = sluchaynoeChislo(MIN_COMMENT_ID, MAX_COMMENT_ID);
    estTakoyId = vseIdKommentariev.includes(noviyId);
  } while (estTakoyId);

  vseIdKommentariev.push(noviyId);

  let skolkoSoobscheniy = sluchaynoeChislo(MIN_MESSAGES, MAX_MESSAGES);
  let tekst = '';

  for (let i = 0; i < skolkoSoobscheniy; i++) {
    if (i > 0) {
      tekst = tekst + ' ';
    }
    tekst = tekst + sluchayniyElement(COMMENTS);
  }

  let kommentariy = {
    id: noviyId,
    avatar: 'img/avatar-' + sluchaynoeChislo(MIN_AVATAR, MAX_AVATAR) + '.svg',
    message: tekst,
    name: sluchayniyElement(NAMES)
  };

  return kommentariy;
}

function sozdatKommentariiDlyaFoto() {
  let skolkoKommentariev = sluchaynoeChislo(MIN_COMMENTS, MAX_COMMENTS);
  let spisokKommentariev = [];

  for (let i = 0; i < skolkoKommentariev; i++) {
    let noviyKommentariy = sozdatKommentariy();
    spisokKommentariev.push(noviyKommentariy);
  }

  return spisokKommentariev;
}

function sozdatFoto(nomer) {
  let foto = {
    id: nomer,
    url: 'photos/' + nomer + '.jpg',
    description: sluchayniyElement(DESCRIPTIONS),
    likes: sluchaynoeChislo(MIN_LIKES, MAX_LIKES),
    comments: sozdatKommentariiDlyaFoto()
  };

  return foto;
}

function sozdatVseFoto() {
  let vseFoto = [];

  for (let i = 1; i <= PHOTOS_COUNT; i++) {
    let novayaFoto = sozdatFoto(i);
    vseFoto.push(novayaFoto);
  }

  return vseFoto;
}

let moiFoto = sozdatVseFoto();

console.log('Привет! Я создал ' + PHOTOS_COUNT + ' фотографий:');
console.log('');

for (let i = 0; i < moiFoto.length; i++) {
  displayPhotoDetails(moiFoto[i], i);
}

console.log('');
console.log('ИТОГО:');

const stats = calculateStatistics(moiFoto);
console.log('Всего фото: ' + stats.totalPhotos);
console.log('Всего лайков: ' + stats.totalLikes);
console.log('Всего комментариев: ' + stats.totalComments);
console.log('В среднем лайков на фото: ' + stats.averageLikes);
console.log('В среднем комментариев на фото: ' + stats.averageComments);

console.log('');
console.log('Весь массив данных:');
console.log(moiFoto);
