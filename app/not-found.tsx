"use client";
import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h2 className="text-4xl font-bold text-red-500 mb-4">404 - Not Found</h2>
      <p className="text-md text-gray-600 mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition duration-200"
      >
        Return Home
      </Link>
    </div>
  );
}
