// src/hooks/useGreetings.js
import { useState, useEffect } from "react";

export const useGreetings = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const getGreeting = () => {
      const date = new Date();
      const hour = date.getHours();
      let newGreeting = "";

      if (hour >= 5 && hour < 12) {
        newGreeting = "Good Morning!";
      } else if (hour >= 12 && hour < 17) {
        newGreeting = "Good Afternoon!";
      } else if (hour >= 17 && hour < 21) {
        newGreeting = "Good Evening!";
      } else {
        newGreeting = "Good Night!";
      }
      setGreeting(newGreeting);
    };

    getGreeting();
    // Update greeting every hour (optional, but nice for long-running sessions)
    const intervalId = setInterval(getGreeting, 1000 * 60 * 60);
    return () => clearInterval(intervalId);
  }, []);

  return greeting;
};
