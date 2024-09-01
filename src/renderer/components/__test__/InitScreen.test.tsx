import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { InitScreen } from "../InitScreen";
import { ELECTRON_EVENTS } from "../../../constants";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("InitScreen 컴포넌트", () => {
  let sendSpy: ReturnType<typeof vi.spyOn>;

  const renderInitScreen = () => {
    render(<InitScreen />);
  };

  beforeEach(() => {
    sendSpy = vi.spyOn(window.electron, "send").mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("분 모드에서 슬라이더 값이 잘 변경되는지 확인", () => {
    renderInitScreen();

    const slider = screen.getByRole("slider") as HTMLInputElement; // 타입을 HTMLInputElement로 캐스팅
    fireEvent.change(slider, { target: { value: "30" } }); // 슬라이더 값 변경
    expect(slider.value).toBe("30");

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("초 모드에서 슬라이더 값이 잘 변경되는지 확인", () => {
    renderInitScreen();

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(checkbox); // 초 모드로 변경
    expect(checkbox.checked).toBe(false);

    const slider = screen.getByRole("slider") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "120" } });
    expect(slider.value).toBe("120");
  });

  it("분 모드에서 시작하기 버튼 클릭 시 데이터가 올바르게 전송되는지 확인", () => {
    renderInitScreen();

    const startButton = screen.getByText("시작하기");
    fireEvent.click(startButton);

    expect(sendSpy).toHaveBeenCalledWith(
      ELECTRON_EVENTS.START_TIMER,
      10 * 60000 // 10분 -> 밀리초로 변환
    );
    expect(mockNavigate).toHaveBeenCalledWith("/exercise");
  });

  it("초 모드에서 시작하기 버튼 클릭 시 데이터가 올바르게 전송되는지 확인", () => {
    renderInitScreen();

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(checkbox); // 초 모드로 변경

    const startButton = screen.getByText("시작하기");
    fireEvent.click(startButton);

    expect(sendSpy).toHaveBeenCalledWith(
      ELECTRON_EVENTS.START_TIMER,
      10 * 1000 // 10초 -> 밀리초로 변환
    );
    expect(mockNavigate).toHaveBeenCalledWith("/exercise");
  });
});
