import _ from 'underscore';

let vowels = ["a", "e", "i", "o", "u"];
vowels = _.shuffle(vowels);

displayVowels();

function displayVowels() {
  for (let vowel of vowels) {
    console.log(vowel);
  }
}