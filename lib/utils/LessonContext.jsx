"use client";
import { createContext, useContext } from "react";

const LessonContext = createContext(null);

export const LessonProvider = ({ children, value }) => {
  return (
    <LessonContext.Provider value={value}>{children}</LessonContext.Provider>
  );
};

export const useLessonContext = () => {
  const context = useContext(LessonContext);
  return context;
};
