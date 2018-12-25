// House rules: The integers generated in this game are all positive. In the case of a division, the denominator generated is the multiple of the numerator. If the player doesn't select a level, the question given out will be additions (+) only.
var result;
var secondsLeftWithoutBonus;
var currentScore = 0;
var highScore = 0;
var timer = null;
var signs = ['+'];
var limit = 10;
var getRandomInt = function (max) {
  return Math.ceil(Math.random() * max);
};
var getMultiple = function (max, num) {
  return Math.ceil(Math.random() * Math.floor(max / num)) * num;
}

// Get and render a new question
var newQuestion = function () {
  if (signs.length === 0) {
    signs = ['+'];
    document.querySelector('#plus').checked = true;
  }
  var sign = signs[Math.floor(Math.random() * signs.length)];
  var num1;
  var num2 = getRandomInt(limit);
  sign === '/' ? num1 = getMultiple(limit, num2) : num1 = getRandomInt(limit);
  document.querySelector('.num-1').innerText = num1;
  document.querySelector('.num-2').innerText = num2;
  document.querySelector('.equal').innerText = '=';
  document.querySelector('.answer').placeholder = '';
  var renderSign = document.querySelector('.sign');
  switch (sign) {
    case '+':
      renderSign.innerText = '+';
      result = num1 + num2;
      break;
    case '-':
      renderSign.innerText = '-';
      result = num1 - num2;
      break;
    case '*':
      renderSign.innerText = '*';
      result = num1 * num2;
      break;
    case '/':
      renderSign.innerText = '/';
      result = num1 / num2;
      break;
  }
};

// At the start of each new round, add event handlers in <div class="game-area">.
var setUpGame = function () {
  var answer = document.querySelector('.answer');
  answer.addEventListener('click', startGameAndCountDown);
  answer.addEventListener('keyup', function () { // 'input' also works
    if (Number(this.value) === result) {
      currentScore++;
      newQuestion();
      this.value = '';
      console.log('you got a one-sec bonus');
    }
  });
};

var restartGame = function () {
  // Render the notification area.
  var notification = document.querySelector('.notification');
  notification.innerHTML = 'Game Over.';
  // Render the score area.
  if (highScore < currentScore) {
    highScore = currentScore;
  }
  currentScore = 0;
  document.querySelector('.high-score').innerHTML = highScore;
  document.querySelector('.current-score').innerHTML = currentScore;
  // Render the game area.
  var gameArea = document.querySelector('.game-area');
  gameArea.style.border = 'none';
  gameArea.innerHTML = '<button class="restart-btn">RESTART</button>';
  gameArea.querySelector('button').addEventListener('click', function () {
    notification.innerHTML = '10 Seconds Left.';
    gameArea.style = '';
    gameArea.innerHTML = '<p class="question"><span class="num-1">Challenge</span>' + ' ' + '<span class="sign">ahead</span>' + ' ' + '<span class="num-2"></span></p><p class="equal">: )</p><input type="number" class="answer" placeholder="click here to start">';
    setUpGame();
  });
};

var broadcastStatus = function () {
  var secondsLeftWithBonus = secondsLeftWithoutBonus + currentScore;
  document.querySelector('.current-score').innerHTML = currentScore;
  // console.log('seconds left without bonus: ', secondsLeftWithoutBonus, ' and seconds left with bonus: ', secondsLeftWithBonus);
  if (secondsLeftWithBonus >= 0) {
    document.querySelector('.notification').innerHTML = secondsLeftWithBonus + ' Second(s) Left';
  } else {
    stopCountDown();
    restartGame();
  }
};

var startGameAndCountDown = function () {
  newQuestion();
  var answer = document.querySelector('.answer');
  if (!timer) {
    var startTime = Date.now() + 10000;
    timer = setInterval(function () {
      secondsLeftWithoutBonus = Math.ceil((startTime - Date.now()) / 1000);
      broadcastStatus();
    }, 1000);
  }
  answer.removeEventListener('click', startGameAndCountDown);
}

var stopCountDown = function () {
  window.clearInterval(timer);
  timer = null;
};

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.number-limit').innerText = limit;

  // Record and display player's choice of the number limit.
  document.querySelector('.arrow-down').addEventListener('click', function () {
    if (limit > 5) {
      limit = limit - 5;
      document.querySelector('.number-limit').innerText = limit;
    }
  });
  document.querySelector('.arrow-up').addEventListener('click', function () {
    limit = limit + 5;
    document.querySelector('.number-limit').innerText = limit;
  });

  // Record player's choice of the game level.
  var checkbox = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < checkbox.length; i++) {
    checkbox[i].addEventListener('change', function () {
      if (this.checked === true) {
        signs.push(this.name);
      } else {
        var index = signs.indexOf(this.name);
        if (index !== -1) {
          var arr = signs.slice(0, index).concat(signs.slice(index + 1));
          signs = arr;
        }
      }
      console.log(signs);
    });
  }

  setUpGame();
});
