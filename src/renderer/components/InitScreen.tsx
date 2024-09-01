import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ELECTRON_EVENTS } from "../../constants";

const maxIntervalMinutes = 180;
const minIntervalMinutes = 1;

export const InitScreen: React.FC = () => {
  const [intervalValue, setIntervalValue] = useState(10);
  const [isMinutes, setIsMinutes] = useState(true); // 체크박스 상태를 위한 상태값 추가
  const navigate = useNavigate();

  const handleStart = () => {
    // 분 단위인지 초 단위인지에 따라 계산
    const intervalInMilliseconds = isMinutes
      ? intervalValue * 60000 // 분일 경우
      : intervalValue * 1000; // 초일 경우

    window.electron.send(ELECTRON_EVENTS.START_TIMER, intervalInMilliseconds);
    navigate("/exercise");
  };

  const handleQuit = () => {
    window.electron.send(ELECTRON_EVENTS.QUIT_APP);
  };

  const handleCheckboxChange = () => {
    setIsMinutes((prev) => !prev);
    setIntervalValue(10); // 초기화
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        눈운동 리마인더 🚀
      </h1>

      <div className="slider-container mb-6 w-3/4 md:w-1/2">
        <div className="flex flex-col items-center mb-4">
          <label
            htmlFor="intervalSlider"
            className="block text-lg font-medium text-gray-700 text-center"
          >
            알림 간격을 선택해주세요
          </label>
          <label className="text-gray-700">
            <input
              type="checkbox"
              checked={isMinutes}
              onChange={handleCheckboxChange}
            />
            분 단위로 설정하기
          </label>
        </div>

        <p className="text-lg text-gray-700 text-center">
          {intervalValue}
          {isMinutes ? "분" : "초"}마다 눈 운동 리마인드를 해드립니다.
        </p>
        <input
          type="range"
          id="intervalSlider"
          min={minIntervalMinutes}
          max={isMinutes ? maxIntervalMinutes : maxIntervalMinutes * 60} // 분이면 1~180, 초면 1~10800 (180*60)
          value={intervalValue}
          onChange={(e) => setIntervalValue(Number(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          시작하기
        </button>
        <button
          onClick={handleQuit}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          오늘은 안할래요
        </button>
      </div>
    </div>
  );
};
