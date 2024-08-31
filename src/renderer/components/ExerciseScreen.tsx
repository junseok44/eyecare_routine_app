import React, { useEffect, useRef, useState } from "react";
import { ELECTRON_EVENTS } from "../../constants";
import { exercises } from "../constants";

const TIME_AFTER_COMPLETE = 3000;
const COUNTDOWN_INTERVAL = 1000;

// 이 페이지의 기능은. window.show 이벤트가 오면, 운동을 시작하고, 카운트다운을 시작하는 것.

export const ExerciseScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [remainingTime, setRemainingTime] = useState(exercises[0].duration);
  const [isExerciseComplete, setIsExerciseComplete] = useState(false);
  const [countdownId, setCountdownId] = useState<NodeJS.Timeout | null>(null);
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);

  const countdownIdRef = useRef<NodeJS.Timeout | null>(countdownId);
  const isExerciseRunningRef = useRef(isExerciseRunning);

  const onCompleted = () => {
    setIsExerciseComplete(true);
    setTimeout(() => {
      window.electron.send(ELECTRON_EVENTS.SET_TIMER_AGAIN);
      initializeTimeAndState();
      setIsExerciseRunning(false);
      isExerciseRunningRef.current = false;
    }, TIME_AFTER_COMPLETE);
  };

  const initializeTimeAndState = () => {
    if (countdownId) clearInterval(countdownId);
    setCurrentStep(0);
    setRemainingTime(exercises[0].duration);
    setIsExerciseComplete(false);
  };

  const startCountdown = () => {
    const countdown = setInterval(() => {
      setRemainingTime((time) => {
        if (time > 1) {
          return time - 1;
        } else {
          clearInterval(countdown);
          setCurrentStep((prevStep) => {
            const nextStep = prevStep + 1;
            if (nextStep < exercises.length) {
              setRemainingTime(exercises[nextStep].duration);
              startCountdown();
            } else {
              onCompleted();
            }
            return nextStep;
          });
          return 0;
        }
      });
    }, COUNTDOWN_INTERVAL);

    setCountdownId(countdown);
  };

  const startExercise = () => {
    setIsExerciseRunning(true);
    isExerciseRunningRef.current = true;
    initializeTimeAndState();
    startCountdown();
  };

  const handleShowWindow = () => {
    if (!isExerciseRunningRef.current) {
      startExercise();
    }
  };

  useEffect(() => {
    window.electron.on(ELECTRON_EVENTS.SHOW_WINDOW, handleShowWindow);
  }, []);

  const handleNextInterval = () => {
    initializeTimeAndState();
    setIsExerciseRunning(false);
    isExerciseRunningRef.current = false;
    window.electron.send(ELECTRON_EVENTS.SET_TIMER_AGAIN);
  };

  const handleQuit = () => {
    if (countdownId) clearInterval(countdownId);
    setIsExerciseRunning(false);
    isExerciseRunningRef.current = false;
    window.electron.send(ELECTRON_EVENTS.QUIT_APP);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isExerciseComplete ? "운동 완료!" : "눈 운동을 시작합니다!"}
      </h1>
      <div
        id="exercise-steps"
        className="text-xl text-gray-700 mb-4 p-4 border border-gray-300 rounded-lg bg-white shadow-md w-3/4 md:w-1/2 text-center"
      >
        {isExerciseComplete ? (
          <div>
            모든 운동이 끝났습니다! 잘 했어요!
            <br />
            다음 인터벌에 다시 안내드릴께요!
            <br />({TIME_AFTER_COMPLETE / 1000}초 후에 창이 닫힙니다.)
          </div>
        ) : (
          <div>
            {exercises[currentStep].text}
            <br />({remainingTime}초 남음)
          </div>
        )}
      </div>

      {isExerciseComplete ? (
        <button
          onClick={handleQuit}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          오늘은 그만할래요
        </button>
      ) : null}

      {!isExerciseComplete && (
        <div className="flex space-x-4">
          <button
            onClick={handleNextInterval}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            바빠요. 다음 인터벌에 안내해주세요
          </button>
          <button
            onClick={handleQuit}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
          >
            오늘은 그만할래요
          </button>
        </div>
      )}
    </div>
  );
};
