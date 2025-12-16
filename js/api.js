const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const loadPhotos = () => {
  return fetch(`${SERVER_URL}/data`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные с сервера');
      }
      return response.json();
    });
};

const uploadPhoto = (formData) => {
  return fetch(SERVER_URL, {
    method: 'POST',
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Не удалось отправить фотографию на сервер');
    }
  });
};

export { loadPhotos, uploadPhoto };
