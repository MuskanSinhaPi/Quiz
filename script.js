const questions = [
    {
        question: "What is the capital of India?",
        answers:[
            {text:"Mumbai", correct: false},
            {text:"New Delhi", correct: true},
            {text:"Kolkata", correct: false},
            {text:"Bangalore", correct: false},
        ]
    },
    {
        question: "Who designed the Indian National Flag?",
        answers:[
            {text:"Rabindranath Tagore", correct: false},
            {text:"Aurobindo Ghosh", correct: false},
            {text:"Pingali Venkayya", correct: true},
            {text:"B.K.Chattopadhyaya", correct: false},
        ]
    },
    {
        question: "Indian Air Force Day is on?",
        answers:[
            {text:"December 4th", correct: false},
            {text:"July 26th", correct: false},
            {text:"October 8th", correct: true},
            {text:"December 7th", correct: false},
        ]
    },
    {
        question: "What was the name of India\'s second nuclear reactor?",
        answers:[
            {text:"Apsara", correct: false},
            {text:"Purnima", correct: true},
            {text:"Cirus", correct: false},
            {text:"Dhruva", correct: false},
        ]
    },
    {
        question: "Where did India launch its first rocket from?",
        answers:[
            {text:"Trombay", correct: false},
            {text:"Sri Hari Kota", correct: false},
            {text:"Bangalore", correct: false},
            {text:"Thumba", correct: true},
        ]
    },
    {
        question: "Which is India\'s first artificial satellite?",
        answers:[
            {text:"Bhaskara", correct: false},
            {text:"INSAT", correct: false},
            {text:"Aryabhatta", correct: true},
            {text:"Rohini", correct: false},
        ]
    },
    {
        question: "Which one of the following rockets of ISRO uses Cryogenic fuel?",
        answers:[
            {text:"Sounding Rockets", correct: false},
            {text:"SSLV", correct: false},
            {text:"PSLV", correct: false},
            {text:"GSLV", correct: true},
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const progress = document.querySelector(".progress-done");
const streak = document.querySelector(".streak-bar");
const fire = document.querySelector(".fire");
const homepage = document.getElementById("home");
const clock = document.getElementById("timer");
const streakDiv = document.querySelector(".streak");

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 20;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

let currentQuestionIndex = 0;
let score = 0;
let streakPt = 0;

clock.innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

function startQuiz(){
    currentQuestionIndex = 0;
    score=0;
    streakPt = 0;
    streakBar(streakPt,7);
    nextButton.innerHTML= "Next";
    shuffleQuestions();
    homepage.style.display = "none";
    clock.style.display = "block";
    streakDiv.style.overflow = "hidden";
    streakDiv.style.display = "block";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;
    questionElement.style.textAlign = "left";
    shuffleChoices(currentQuestion);
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer)
    });
    progressBar(currentQuestionIndex + 1,questions.length);
    resetTimer();
    startTimer();
}

function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

function progressBar(qs,totalQs){
    progress.style.width = `${((qs)/totalQs)*100}%`;
    if(qs===1){
        progress.innerHTML = `${qs}/${totalQs}`;
    }
    else{
        progress.innerHTML = `${qs}/${totalQs} QUESTIONS`;
    }
}

function streakBar(stk,totalQs){
    const barHeight = (stk / totalQs) * 100;
    streak.style.height = `${barHeight}%`;
    if (stk>0){
        streak.innerHTML = `${stk}`;
    }
    if (stk==7){
      streakDiv.style.overflow = "visible";
    }
    const containerHeight = document.querySelector('.streak').clientHeight;
    const overlayHeight = (stk / totalQs) * containerHeight;
    fire.style.bottom = `${overlayHeight}px`;
}

function shuffleChoices(question) {
    for (let i = 3; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [question.answers[i], question.answers[j]] = [question.answers[j], question.answers[i]];
    }
}

function selectAnswer(e){
    stopTimer();
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect){
        selectedBtn.classList.add("correct");
        streakPt++;
        score++;
    } else{
        selectedBtn.classList.add("incorrect");
        streakPt = 0;
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled=true;
    });
    streakBar(streakPt,questions.length);
    nextButton.style.display = "block";
}

function showScore(){
    resetState();
    clock.style.display = "none";
    questionElement.innerHTML = `YOU SCORED ${score} OUT OF ${questions.length}`;
    questionElement.style.textAlign = "center";
    nextButton.innerHTML= "PLAY AGAIN";
    nextButton.style.display = "block";

    if (score === questions.length) {
        confettiStart();
        confettiStop();
    }
}

function handleNextButton(){
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        homepage.style.display = "block";
        streakDiv.style.display = "none";
        showScore();
    }
}

nextButton.addEventListener("click",()=>{
    if (currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
});

const confettiStart = () => {
    setTimeout(function(){
        confetti.start();
    },500);
};

const confettiStop = () => {
      setTimeout(function () {
        confetti.stop();
      },4000);
};

startQuiz();

function onTimesUp() {
  streakBar(0,questions.length);
  resetTimer();
  handleNextButton();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function stopTimer() {
    clearInterval(timerInterval);
  }

function resetTimer() {
    clearInterval(timerInterval);
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);
    remainingPathColor = COLOR_CODES.info.color; 
    document.getElementById("base-timer-path-remaining").classList.remove(COLOR_CODES.alert.color, COLOR_CODES.warning.color);
    document.getElementById("base-timer-path-remaining").classList.add(remainingPathColor);
}
  
  
