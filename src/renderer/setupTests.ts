import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

window.electron = {
  send: vi.fn(),
  on: vi.fn(),
};
