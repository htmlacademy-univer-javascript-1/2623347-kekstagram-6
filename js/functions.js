function checkStringLength(string, maxLength) {
  return string.length <= maxLength;
}

function isPalindrome(string) {
  const normalizedString = string.toLowerCase().replaceAll(' ', '');

  const reversedString = normalizedString.split('').reverse().join('');

  return normalizedString === reversedString;
}

function extractNumbers(string) {
  return string.toString().replace(/\D/g, '');
}

console.log('Проверка длины строки:');
console.log(checkStringLength('проверяемая строка', 20)); // true
console.log(checkStringLength('проверяемая строка', 18)); // true
console.log(checkStringLength('проверяемая строка', 10)); // false

console.log('\nПроверка палиндромов:');
console.log(isPalindrome('топот')); // true
console.log(isPalindrome('ДовОд')); // true
console.log(isPalindrome('Кекс'));  // false

console.log('\nИзвлечение цифр:');
console.log(extractNumbers('2024 год')); // "2024"
console.log(extractNumbers('ECMAScript 2022')); // "2022"
console.log(extractNumbers('1 кефир, 0.5 батона')); // "105"
console.log(extractNumbers('агент 007')); // "007"

