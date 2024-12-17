import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Router from "./Router";
import "./styles/app.scss";

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    const body = document.body;

    if (isDark) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }

    localStorage.setItem("theme", isDark ? "dark" : "");

    return () => {
      body.classList.remove("dark");
    };
  }, [isDark]);

  return (
    <>
      <Nav setIsDark={setIsDark} isDark={isDark} />
      <Router />
    </>
  );
}

export default App;
