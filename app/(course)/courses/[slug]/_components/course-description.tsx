// @ts-nocheck
"use client";
import { useState } from "react";

export default function CourseDescription({ course }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleDescription = () => setIsExpanded(!isExpanded);

  const shortDescriptionLimit = 800; // Set the character limit for short description
  const shortDescription = course.description?.substring(
    0,
    shortDescriptionLimit
  );
  const isTruncated =
    course.description && course.description.length > shortDescriptionLimit;

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold mb-4">Description</h1>
      <div>
        <p
          className="text-sm mb-4 text-black text-justify"
          dangerouslySetInnerHTML={{
            __html: isExpanded
              ? course.description
              : `${shortDescription}${isTruncated ? "..." : ""}`,
          }}
        />
        {isTruncated && (
          <button
            onClick={toggleDescription}
            className="text-blue-500 hover:underline text-sm"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
