let imena = ['Саша', 'Маша', 'Петя', 'Катя', 'Вова', 'Лена', 'Дима', 'Оля', 'Коля', 'Настя'];
let kommentarii = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат.',
  'Лица у людей на фотке перекошены!'
];
let opisaniya = [
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
    noviyId = sluchaynoeChislo(1, 1000);
    estTakoyId = vseIdKommentariev.includes(noviyId);
  } while (estTakoyId);

  vseIdKommentariev.push(noviyId);

  let skolkoSoobscheniy = sluchaynoeChislo(1, 2);
  let tekst = '';

  for (let i = 0; i < skolkoSoobscheniy; i++) {
    if (i > 0) {
      tekst = tekst + ' ';
    }
    tekst = tekst + sluchayniyElement(kommentarii);
  }

  let kommentariy = {
    id: noviyId,
    avatar: 'img/avatar-' + sluchaynoeChislo(1, 6) + '.svg',
    message: tekst,
    name: sluchayniyElement(imena)
  };

  return kommentariy;
}

function sozdatKommentariiDlyaFoto() {
  let skolkoKommentariev = sluchaynoeChislo(0, 30);
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
    description: sluchayniyElement(opisaniya),
    likes: sluchaynoeChislo(15, 200),
    comments: sozdatKommentariiDlyaFoto()
  };

  return foto;
}

function sozdatVseFoto() {
  let vseFoto = [];

  for (let i = 1; i <= 25; i++) {
    let novayaFoto = sozdatFoto(i);
    vseFoto.push(novayaFoto);
  }

  return vseFoto;
}

let moiFoto = sozdatVseFoto();

console.log('Привет! Я создал 25 фотографий:');
console.log('');

for (let i = 0; i < moiFoto.length; i++) {
  let foto = moiFoto[i];
  console.log('Фото номер ' + (i + 1) + ':');
  console.log('• ID: ' + foto.id);
  console.log('• Файл: ' + foto.url);
  console.log('• Описание: ' + foto.description);
  console.log('• Лайков: ' + foto.likes);
  console.log('• Комментариев: ' + foto.comments.length);

  if (foto.comments.length > 0) {
    console.log('  Комментарии:');
    for (let j = 0; j < foto.comments.length; j++) {
      let komment = foto.comments[j];
      console.log('  - ' + komment.name + ': ' + komment.message);
    }
  }
  console.log('---');
}

console.log('');
console.log('ИТОГО:');
console.log('Всего фото: ' + moiFoto.length);

let vsegoLaikov = 0;
let vsegoKommentariev = 0;

for (let i = 0; i < moiFoto.length; i++) {
  vsegoLaikov = vsegoLaikov + moiFoto[i].likes;
  vsegoKommentariev = vsegoKommentariev + moiFoto[i].comments.length;
}

console.log('Всего лайков: ' + vsegoLaikov);
console.log('Всего комментариев: ' + vsegoKommentariev);
console.log('В среднем лайков на фото: ' + Math.round(vsegoLaikov / moiFoto.length));
console.log('В среднем комментариев на фото: ' + Math.round(vsegoKommentariev / moiFoto.length));

console.log('');
console.log('Весь массив данных:');
console.log(moiFoto);
