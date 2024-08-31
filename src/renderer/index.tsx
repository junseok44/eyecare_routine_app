import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { InitScreen } from "./components/InitScreen";
import { ExerciseScreen } from "./components/ExerciseScreen";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={InitScreen} />
        <Route path="/exercise" Component={ExerciseScreen} />
      </Routes>
    </Router>
  );
};

const rootNode = document.getElementById("root");

ReactDOM.createRoot(rootNode!).render(<App />);
