"use client";
import { Provider } from "react-redux";
import { useRef } from "react";
import { makeStore } from "../lib/redux/store";

const StoreProvider = ({ children }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
