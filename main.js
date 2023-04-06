function randint(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

function getRandomSign() {
  return signs[randint(0, signs.length - 1)];
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) { // Цикл повторяется до тех пор, пока остаются элементы для перемешивания
    randomIndex = Math.floor(Math.random() * currentIndex); // Выбираем оставшийся элемент.
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [    // Меняем местами с текущим элементом.
      array[randomIndex], array[currentIndex]];
  }
  return array; // Возвращаем перемешанный массив
}

let main = document.querySelector('.main')
let start = document.querySelector('.start')
let question_field = document.querySelector(".question");
let answer_buttons = document.querySelectorAll(".answer");
let container_title = document.querySelector('.container-title');
let startBtn = document.querySelector('.start-btn');

let signs = ['+', '-', '*', '/'];
//            0    1    2    3
let cookie = false;
let cookies = document.cookie.split('; ');

for (let i = 0; i < cookies.length; i++) {
  if (cookies[i].split('=')[0] === 'numbers_high_score') {
    cookie = cookies[i].split('=')[1];
  }
}

if (cookie) {
  let data = cookie.split('/');
  container_title.innerHTML = `В прошлый раз вы дали ${data[0]} верных ответов из ${data[1]}. Точность - ${Math.round(data[0] * 100 / data[1])}%!`;
}

class Question {
  constructor() {
    let a = randint(1, 30);
    let b = randint(1, 30);
    this.sign = getRandomSign();
    
    if (this.sign === '+') {
      this.correct = a + b;
    } else if (this.sign === '-') {
      this.correct = a - b;
    } else if (this.sign === '/') {
      while (!Number.isInteger(a / b)) { // пока a/b не целое число
        a = randint(1, 30);
        b = randint(1, 30);
      }
      this.correct = a / b;
    } else if (this.sign === '*') {
      this.correct = a * b;
    }

    this.question = `${a} ${this.sign} ${b}`;
    this.answers = [
      randint(this.correct - 15, this.correct + 5),
      randint(this.correct - 15, this.correct + 5),
      this.correct,
      randint(this.correct - 1, this.correct + 15),
      randint(this.correct - 1, this.correct + 15)
    ];

    // для this.answers тут необходимо вызвать функцию shuffle()
    shuffle(this.answers);
  }

  display() {
    question_field.innerHTML = this.question;

    for (let i = 0; i < this.answers.length; i++) {
      answer_buttons[i].textContent = this.answers[i];
    }
  }
}

let correct_answers_given;
let total_answers_given;
let current_question;


startBtn.addEventListener('click', function () {
  main.style.display = 'flex';
  start.style.display = 'none';
  
  correct_answers_given = 0;
  total_answers_given = 0;
  current_question = new Question();
  current_question.display();

  setTimeout(function () {
    let new_cookie = `numbers_high_score=${correct_answers_given}/${total_answers_given}; max-age=1000000`;
    document.cookie = new_cookie;

    main.style.display = 'none';
    start.style.display = 'flex';

    container_title.innerHTML = `${correct_answers_given} правильных ответов из ${total_answers_given}.
    Точность - ${Math.round(correct_answers_given * 100 / total_answers_given)}%!`;
  }, 10000)
});

for (let i = 0; i < answer_buttons.length; i++) {
  answer_buttons[i].addEventListener("click", function () {
    total_answers_given++;

    if (+answer_buttons[i].innerHTML === current_question.correct) {
      correct_answers_given++;
      answer_buttons[i].style.backgroundColor = "#00ff00";
      anime({
        targets: answer_buttons[i],
        backgroundColor: "#ffffff",
        duration: 500,
        delay: 100,
        easing: 'linear'
      })
    } else {
      // По аналогии с правильным ответом реализовать анимацию смены цвета при клике на неправильный ответ
      // менять цвет на красный
      answer_buttons[i].style.backgroundColor = "#ff0000";
      anime({
        targets: answer_buttons[i],
        backgroundColor: "#ffffff",
        duration: 500,
        delay: 100,
        easing: 'linear'
      })
    }

    current_question = new Question();
    current_question.display();
  });
}