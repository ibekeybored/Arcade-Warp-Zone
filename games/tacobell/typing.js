const words = 'avocado salsa verde packet, cantina chicken bowl, cantina chicken burrito, cantina chicken crispy taco, cantina chicken quesadilla, cantina chicken soft taco, dragonfruit freeze, dragonfruit freeze, dragonfruit freeze with dragonfruit syrup, dragonfruit freeze with dragonfruit syrup, tacos: black bean chalupa supreme, chalupa supreme beef, chalupa supreme chicken, chalupa supreme steak, cheesy gordita crunch, crunchy taco, crunchy taco supreme, doritos cheesy gordita crunch nacho cheese, double decker taco, double decker taco supreme, double stacked taco, nacho cheese doritos locos taco, nacho cheese doritos locos taco supreme, soft taco beef, soft taco chicken, soft taco supreme beef, soft taco supreme chicken, spicy potato soft taco, burritos: bean burrito, beefy layer burrito, black bean grilled cheese burrito, burrito supreme beef, burrito supreme chicken, burrito supreme steak, cheesy bean and rice burrito, cheesy double beef burrito, chicken enchilada burrito, chili cheese burrito, grilled cheese burrito, grilled cheese burrito chicken, grilled cheese burrito steak, nachos: chips and nacho cheese sauce, loaded beef nachos, nachos bellgrande beef, nachos bellgrande chicken, nachos bellgrande steak, quesadillas: quesadilla cheese, quesadilla chicken, quesadilla steak, specialties: cheese chicken flatbread melt, black bean crunchwrap supreme, cheesy roll up, crunchwrap supreme, mexican pizza, stacker, veggie mexican pizza, sides and sweets: black beans and rice, black beans, cheesy fiesta potatoes, cinnabon delights, cinnabon delights, cinnamon twists, diablo sauce packet, fire sauce packet, hot sauce packet, mild sauce packet, pintos n cheese, drinks: cinnabon delights coffee hot, cinnabon delights coffee iced, hot coffee with creamer, iced coffee with creamer, lowfat milk ca, lowfat milk federal, mtn dew baja blast freeze, mtn dew baja blast freeze, orange juice, premium roast coffee hot, premium roast coffee iced, water, wild strawberry freeze, wild strawberry freeze, cravings value menu: cheese chicken flatbread melt value menu, cheesy bean and rice burrito value menu, cheesy double beef burrito value menu, cheesy fiesta potatoes value menu, cheesy roll up value menu, chicken enchilada burrito value menu, double decker taco value menu, double decker taco supreme value menu, double stacked taco value menu, loaded beef nachos value menu, spicy potato soft taco value menu, veggie cravings: taco bell is the first qsr restaurant to offer an american vegetarian association menu. bean burrito, black bean chalupa supreme, black bean crunchwrap supreme, black beans, black beans and rice, cheese quesadilla, cheesy bean and rice burrito, cheesy fiesta potatoes, cheesy roll up, chips and nacho cheese sauce, cinnabon delights, cinnabon delights, cinnamon twists, hash brown, pintos n cheese, spicy potato soft taco, breakfast: breakfast california crunchwrap bacon, breakfast crunchwrap bacon, breakfast crunchwrap sausage patty, breakfast crunchwrap steak, breakfast quesadilla bacon, breakfast quesadilla sausage, breakfast quesadilla steak, breakfast salsa packet, cheesy toasted breakfast burrito bacon, cheesy toasted breakfast burrito fiesta potato, cheesy toasted breakfast burrito sausage, cinnabon delights, cinnabon delights, cinnabon delights coffee hot, cinnabon delights coffee iced, grande toasted breakfast burrito bacon, grande toasted breakfast burrito sausage, grande toasted breakfast burrito steak, hash brown, hash brown toast'.split(' ');

const wordCount = words.length;
const gameTime = 30 * 1000;

window.timer = null;
window.gameStart = null;
window.pauseTime = 0;

function addClass(c,name) {
  c.className += ' '+name;
}
function removeClass(c,name) {
  c.className = c.className.replace(name,'');
}

function randomWord() {
  const randomWord = Math.ceil(Math.random() * wordCount);
  return words[randomWord - 1];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  document.getElementById('words').innerHTML = '';
  for (let i = 0; i < 200; i++) {
    document.getElementById('words').innerHTML += formatWord(randomWord());
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').innerHTML = (gameTime / 1000) + '';
  window.timer = null;
}

function getWPM() {
  const words = [...document.querySelectorAll('.word')];
  const lastWord = document.querySelector('.word.current');
  const lastWordIndex = words.indexOf(lastWord) + 1;
  const typedWords = words.slice(0, lastWordIndex);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const badLetters = letters.filter(letter => letter.className.includes('incorrect'));
    const goodLetters = letters.filter(letter => letter.className.includes('correct'));
    return badLetters.length === 0 && goodLetters.length === letters.length;
  });
  return correctWords.length / gameTime * 60000;
}

function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');
  const result = getWPM();
  document.getElementById('info').innerHTML = `WPM: ${result}`;
}

document.getElementById('game').addEventListener('keyup', ev => {
  const key = ev.key;
  const currentWord = document.querySelector('.word.current');
  const currentLetter = document.querySelector('.letter.current');
  const expected = currentLetter?.innerHTML || ' ';
  const letter = key.length === 1 && key !== ' ';
  const space = key === ' ';
  const backspace = key === 'Backspace';
  const firstLetter = currentLetter === currentWord.firstChild;

  if (document.querySelector('#game.over')) {
    return;
  }

  console.log({key,expected});

  if (!window.timer && letter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }
      const currentTime = (new Date()).getTime();
      const msPassed = currentTime - window.gameStart;
      const secondsPassed = Math.round(msPassed / 1000);
      const secondsLeft = Math.round((gameTime / 1000) - secondsPassed);
      if (secondsLeft <= 0) {
        gameOver();
        return;
      }
      document.getElementById('info').innerHTML = secondsLeft + '';
    }, 1000);
  }

  if (letter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
      removeClass(currentLetter, 'current');
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, 'current');
      }
    } else {
      const incorrectLetter = document.createElement('span');
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = 'letter incorrect extra';
      currentWord.appendChild(incorrectLetter);
    }
  }

  if (space) {
    if (expected !== ' ') {
      const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
      lettersToInvalidate.forEach(letter => {
        addClass(letter, 'incorrect');
      });
    }
    removeClass(currentWord, 'current');
    addClass(currentWord.nextSibling, 'current');
    if (currentLetter) {
      removeClass(currentLetter, 'current');
    }
    addClass(currentWord.nextSibling.firstChild, 'current');
  }

  if (backspace) {
    if (currentLetter && firstLetter) {
      removeClass(currentWord, 'current');
      addClass(currentWord.previousSibling, 'current');
      removeClass(currentLetter, 'current');
      addClass(currentWord.previousSibling.lastChild, 'current');
      removeClass(currentWord.previousSibling.lastChild, 'incorrect');
      removeClass(currentWord.previousSibling.lastChild, 'correct');
    }
    if (currentLetter && !firstLetter) {
      removeClass(currentLetter, 'current');
      addClass(currentLetter.previousSibling, 'current');
      removeClass(currentLetter.previousSibling, 'incorrect');
      removeClass(currentLetter.previousSibling, 'correct');
    }
    if (!currentLetter) {
      addClass(currentWord.lastChild, 'current');
      removeClass(currentWord.lastChild, 'incorrect');
      removeClass(currentWord.lastChild, 'correct');
    }
  }

  if (currentWord.getBoundingClientRect().top > 250) {
    const words = document.getElementById('words');
    const margin = parseInt(words.style.marginTop || '0px');
    words.style.marginTop = (margin - 35) + 'px';
  }

  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

document.getElementById('newGameBtn').addEventListener('click', () => {
  gameOver();
  newGame();
});

newGame();