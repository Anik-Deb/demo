// @ts-nocheck
"use client";
import React from "react";

const ErrorPage = ({ error, reset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-md text-center">
        <h2 className="text-4xl font-bold text-red-500 mb-4">Oops!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Something went wrong. Please try again.
        </p>
        {/* <p className="text-red-500 mb-4">{error?.message}</p> */}
        <button
          onClick={reset}
          className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
