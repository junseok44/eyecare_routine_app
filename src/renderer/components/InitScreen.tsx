import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ELECTRON_EVENTS } from "../../constants";

const maxIntervalMinutes = 180;
const minIntervalMinutes = 1;

export const InitScreen: React.FC = () => {
  const [intervalMinutes, setIntervalMinutes] = useState(10);
  const navigate = useNavigate();

  const handleStart = () => {
    window.electron.send(ELECTRON_EVENTS.START_TIMER, intervalMinutes * 60000);
    navigate("/exercise");
  };

  const handleQuit = () => {
    window.electron.send(ELECTRON_EVENTS.QUIT_APP);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        눈 건강 지킴이
      </h1>
      <div className="slider-container mb-6 w-3/4 md:w-1/2">
        <label
          htmlFor="intervalSlider"
          className="block text-lg font-medium text-gray-700 mb-2 text-center"
        >
          알림 간격을 선택해주세요
        </label>
        <p className="text-lg text-gray-700 mb-6 text-center">
          {intervalMinutes}분마다 눈 운동 리마인드를 해드립니다.
        </p>
        <input
          type="range"
          id="intervalSlider"
          min={minIntervalMinutes}
          max={maxIntervalMinutes}
          value={intervalMinutes}
          onChange={(e) => setIntervalMinutes(Number(e.target.value))}
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
