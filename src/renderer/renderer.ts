const { electron } = window;

const exercises = [
  { text: "1단계: 눈을 감고 휴식하세요.", duration: 20 },
  { text: "2단계: 눈을 시계방향으로 천천히 돌리세요.", duration: 10 },
  { text: "3단계: 눈을 반시계방향으로 천천히 돌리세요.", duration: 10 },
  { text: "4단계: 창 밖 먼 곳을 응시하세요.", duration: 10 },
  { text: "5단계: 눈을 빠르게 깜빡이세요.", duration: 10 },
  { text: "6단계: 눈을 감고 깊게 숨 쉬세요.", duration: 10 },
];

const exerciseDiv = document.getElementById("exercise-steps");
const startBtn = document.getElementById("startBtn");
const hideBtn = document.getElementById("hideBtn");
let currentStep = 0;
let exerciseInterval: NodeJS.Timeout;
let countdownInterval: NodeJS.Timeout;

function showNextExercise() {
  if (currentStep < exercises.length) {
    const currentExercise = exercises[currentStep];
    let remainingTime = currentExercise.duration;

    exerciseDiv!.innerText = `${currentExercise.text} (${remainingTime}초 남음)`;
    currentStep++;

    countdownInterval = setInterval(() => {
      remainingTime--;
      if (remainingTime > 0) {
        exerciseDiv!.innerText = `${currentExercise.text} (${remainingTime}초 남음)`;
      } else {
        clearInterval(countdownInterval);
        if (currentStep < exercises.length) {
          showNextExercise(); // 다음 단계로 진행
        } else {
          exerciseDiv!.innerText = "운동이 끝났습니다! 잘하셨어요!";
        }
      }
    }, 1000);
  } else {
    clearInterval(exerciseInterval);
  }
}

startBtn!.addEventListener("click", () => {
  console.log("startBtn clicked");

  currentStep = 0;
  clearInterval(countdownInterval); // 이전에 남아있을 수 있는 타이머 초기화
  showNextExercise();
});

hideBtn!.addEventListener("click", () => {
  console.log("hideBtn clicked");

  electron.send("hide-window"); // 창을 숨기도록 메인 프로세스에 요청
});
