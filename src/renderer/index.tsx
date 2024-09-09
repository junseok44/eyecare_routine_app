import "./index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { InitScreen } from "./components/InitScreen";
import { ExerciseScreen } from "./components/ExerciseScreen";

// createHashRouter를 사용하여 라우팅 설정
const router = createHashRouter([
  {
    path: "/",
    element: <InitScreen />,
  },
  {
    path: "/exercise",
    element: <ExerciseScreen />,
  },
]);

const rootNode = document.getElementById("root");

if (rootNode) {
  createRoot(rootNode).render(<RouterProvider router={router} />);
} else {
  console.error("Root element not found!");
}
