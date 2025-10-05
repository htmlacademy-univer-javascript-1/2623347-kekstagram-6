export function calculateStatistics(photos) {
  let totalLikes = 0;
  let totalComments = 0;

  for (let i = 0; i < photos.length; i++) {
    totalLikes += photos[i].likes;
    totalComments += photos[i].comments.length;
  }

  return {
    totalPhotos: photos.length,
    totalLikes: totalLikes,
    totalComments: totalComments,
    averageLikes: Math.round(totalLikes / photos.length),
    averageComments: Math.round(totalComments / photos.length)
  };
}

export function displayPhotoDetails(photo, index) {
  console.log('Фото номер ' + (index + 1) + ':');
  console.log('• ID: ' + photo.id);
  console.log('• Файл: ' + photo.url);
  console.log('• Описание: ' + photo.description);
  console.log('• Лайков: ' + photo.likes);
  console.log('• Комментариев: ' + photo.comments.length);

  if (photo.comments.length > 0) {
    console.log('  Комментарии:');
    for (let j = 0; j < photo.comments.length; j++) {
      const comment = photo.comments[j];
      console.log('  - ' + comment.name + ': ' + comment.message);
    }
  }
  console.log('---');
}
