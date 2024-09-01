import { act, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ELECTRON_EVENTS } from "../../../constants";
import { ExerciseScreen } from "../ExerciseScreen";

// exercises 모듈 모킹
vi.mock("../../constants", () => {
  return {
    exercises: [
      { text: "첫 번째 운동", duration: 15 },
      { text: "두 번째 운동", duration: 15 },
    ],
  };
});

describe("ExerciseScreen 컴포넌트", () => {
  let sendSpy: ReturnType<typeof vi.spyOn>;
  let onSpy: ReturnType<typeof vi.spyOn>;
  let audioPlaySpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Electron 메서드에 스파이 설정
    sendSpy = vi.spyOn(window.electron, "send").mockImplementation(vi.fn());
    onSpy = vi.spyOn(window.electron, "on").mockImplementation(vi.fn());

    // HTMLAudioElement의 play 메서드 모킹
    audioPlaySpy = vi
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    vi.clearAllMocks(); // 각 테스트 이후 모의 상태 초기화
  });

  it("SHOW_WINDOW 이벤트 발생 시 운동 시작 및 각 단계별 화면 전환 확인", async () => {
    vi.useFakeTimers(); // 가상 타이머 사용

    render(<ExerciseScreen />);

    // SHOW_WINDOW 이벤트 트리거
    act(() => {
      (window.electron.on as ReturnType<typeof vi.fn>).mock.calls[0][1](); // 콜백 호출
    });

    // 첫 번째 운동이 올바르게 표시되는지 확인
    expect(screen.getByText("눈 운동을 시작합니다!")).toBeInTheDocument();
    expect(screen.getByText(/첫 번째 운동/)).toBeInTheDocument();
    expect(screen.getByText(/15초 남음/)).toBeInTheDocument();

    // 15초 경과 후 다음 운동으로 전환
    act(() => {
      vi.advanceTimersByTime(15000); // 15초 경과
    });

    expect(screen.getByText(/두 번째 운동/)).toBeInTheDocument();
    expect(screen.getByText(/15초 남음/)).toBeInTheDocument();

    // 오디오 재생 확인
    expect(audioPlaySpy).toHaveBeenCalledTimes(1); // 첫 번째 운동 완료 후 오디오 재생 확인

    // 운동이 끝나기 전 경과시간을 시뮬레이션 (10초)
    act(() => {
      vi.advanceTimersByTime(10000); // 10초 경과
    });

    // 두 번째 운동의 시간이 줄어들었는지 확인
    expect(screen.getByText(/5초 남음/)).toBeInTheDocument(); // 10초 경과로 남은 시간 5초

    act(() => {
      vi.advanceTimersByTime(5000); // 5초 경과
    });

    // 운동 완료 후 화면 확인
    expect(screen.getByText(/운동 완료!/)).toBeInTheDocument();

    // 운동 완료 후 오디오 재생 확인
    expect(audioPlaySpy).toHaveBeenCalledTimes(2); // 운동 완료 시 두 번째 오디오 재생 확인

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // 운동 완료 후 다시 타이머 설정 요청 확인
    expect(sendSpy).toHaveBeenCalledWith(ELECTRON_EVENTS.SET_TIMER_AGAIN);
  });
});
