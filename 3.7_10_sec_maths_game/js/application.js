var getRandomInt = function (max) {
  return Math.ceil(Math.random() * max);
};
var result;
var secondsLeftWithoutBonus;
var bonus = 0;
var timer = null;

var startGame = function () {
  var num1 = getRandomInt(10);
  var num2 = getRandomInt(10);
  var sign = '+';
  var equal = '=';
  result = num1 + num2;
  document.querySelector('.num-1').innerText = num1;
  document.querySelector('.sign').innerText = sign;
  document.querySelector('.num-2').innerText = num2;
  document.querySelector('.equal').innerText = equal;
  document.querySelector('.answer').placeholder = '';
};

var setUpGame = function () {
  var answer = document.querySelector('.answer');
  answer.addEventListener('click', startGameAndCountDown);
  answer.addEventListener('keyup', function () { // 'input' also works
    if (Number(this.value) === result) {
      bonus++;
      startGame();
      this.value = '';
      console.log('you got one second bonus');
    }
  });
};

var restartGame = function () {
  var gameArea = document.querySelector('.game-area');
  var notification = document.querySelector('.notification');
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
  var currentScore = document.querySelector('.current-score');
  var notification = document.querySelector('.notification');
  var secondsLeftWithBonus = secondsLeftWithoutBonus + bonus;
  currentScore.innerHTML = bonus;
  console.log('seconds left without bonus: ', secondsLeftWithoutBonus, ' and seconds left with bonus: ', secondsLeftWithBonus);
  if (secondsLeftWithBonus >= 0) {
    notification.innerHTML = secondsLeftWithBonus + ' Second(s) Left';
  } else {
    notification.innerHTML = 'Game Over.';
    bonus = 0;
    stopCountDown();
    restartGame();
  }
};

var startGameAndCountDown = function () {
  startGame();
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

document.addEventListener('DOMContentLoaded', setUpGame);
